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

// API controller for user authentication and JWT token management
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

    // POST: api/auth/register - register a new user account
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult> Register([FromBody] RegisterRequest req)
    {
        // Enforce unique email before creating a new user
        if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            return Conflict(new { message = "Username already exists." });

        PasswordHasher.CreateHash(req.Password, out var hash, out var salt);

        var user = new User
        {
            Email = req.Email.Trim(),
            Role = req.Role ?? "student",
            PasswordHash = hash,
            PasswordSalt = salt,
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Register), new { id = user.Id }, new { user.Id, user.Email, user.Role });
    }

    // POST: api/auth/login - authenticate user and issue access/refresh tokens
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<TokenResponse>> Login([FromBody] LoginRequest req)
    {
        var user = await _db.Users.Include(u => u.RefreshTokens)
                                  .SingleOrDefaultAsync(u => u.Email == req.Email);
        if (user is null || !PasswordHasher.Verify(req.Password, user.PasswordHash, user.PasswordSalt))
            return Unauthorized();

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Email),
            new Claim(ClaimTypes.Role, user.Role ?? "student")
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

    // POST: api/auth/refresh - exchange a valid refresh token for a new access token
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
            new Claim(ClaimTypes.Name, user.Email),
            new Claim(ClaimTypes.Role, user.Role ?? "student")
        };

        var (access, exp) = _tokens.GenerateAccessToken(claims);

        // Rotate the refresh token: revoke old and issue a new one
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

    // POST: api/auth/logout - revoke a specific refresh token for the current user
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] RefreshRequest req)
    {
        var rt = await _db.RefreshTokens.SingleOrDefaultAsync(r => r.Token == req.RefreshToken);
        if (rt is null) return NoContent();   

        // Ensure the refresh token belongs to the current authenticated user
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (rt.UserId != userId) return Forbid();

        rt.RevokedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // GET: api/auth/me - returns basic information about the current user
    [Authorize]
    [HttpGet("me")]
    public IActionResult Me() => Ok(new { user = User.Identity?.Name });
}
