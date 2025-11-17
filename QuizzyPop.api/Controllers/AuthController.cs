using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;
using QuizzyPop.Services;
using QuizzyPop.Api.Options;
using Microsoft.Extensions.Options;

namespace QuizzyPop.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IJwtTokenService _tokens;
    private readonly DAL.UserDbContext _db;
    private readonly JwtSettings _cfg;

    public AuthController(IJwtTokenService tokens, DAL.UserDbContext db, IOptions<JwtSettings> cfg)
    {
        _tokens = tokens;
        _db = db;
        _cfg = cfg.Value;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult> Register([FromBody] RegisterRequest req)
    {
        if (await _db.Users.AnyAsync(u => u.Username == req.Username))
            return Conflict(new { message = "Username already exists." });

        PasswordHasher.CreateHash(req.Password, out var hash, out var salt);

        var user = new User
        {
            Username = req.Username.Trim(),
            Email = req.Email.Trim(),
            PasswordHash = hash,
            PasswordSalt = salt
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Register), new { id = user.Id }, new { user.Id, user.Username, user.Email });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<TokenResponse>> Login([FromBody] LoginRequest req)
    {
        var user = await _db.Users.Include(u => u.RefreshTokens)
                                  .SingleOrDefaultAsync(u => u.Username == req.Username);
        if (user is null || !PasswordHasher.Verify(req.Password, user.PasswordHash, user.PasswordSalt))
            return Unauthorized();

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, "User")
        };

        var (access, exp) = _tokens.GenerateAccessToken(claims);
        var refresh = new RefreshToken
        {
            Token = _tokens.GenerateRefreshToken(),
            CreatedAt = DateTimeOffset.UtcNow,
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(_cfg.RefreshTokenDays),
            UserId = user.Id
        };

        _db.RefreshTokens.Add(refresh);
        await _db.SaveChangesAsync();

        return Ok(new TokenResponse(access, refresh.Token, exp));
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<TokenResponse>> Refresh([FromBody] RefreshRequest req)
    {
        var rt = await _db.RefreshTokens.Include(r => r.User)
                                        .SingleOrDefaultAsync(r => r.Token == req.RefreshToken);
        if (rt is null || !rt.IsActive) return Unauthorized();

        var user = rt.User!;
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, "User")
        };

        var (access, exp) = _tokens.GenerateAccessToken(claims);

        rt.RevokedAt = DateTimeOffset.UtcNow;
        var newRt = new RefreshToken
        {
            Token = _tokens.GenerateRefreshToken(),
            CreatedAt = DateTimeOffset.UtcNow,
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(_cfg.RefreshTokenDays),
            UserId = user.Id
        };
        _db.RefreshTokens.Add(newRt);
        await _db.SaveChangesAsync();

        return Ok(new TokenResponse(access, newRt.Token, exp));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] RefreshRequest req)
    {
        var rt = await _db.RefreshTokens.SingleOrDefaultAsync(r => r.Token == req.RefreshToken);
        if (rt is null) return NoContent();   

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (rt.UserId != userId) return Forbid();

        rt.RevokedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me() => Ok(new { user = User.Identity?.Name });
}
