using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizzyPop.Services;

namespace QuizzyPop.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IJwtTokenService tokens) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    public ActionResult<TokenResponse> Login([FromBody] LoginRequest req)
    {

        if (req.Username != "demo" || req.Password != "pass123!")
            return Unauthorized();

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "1"),
            new Claim(ClaimTypes.Name, req.Username),
            new Claim(ClaimTypes.Role, "User")
        };

        var (jwt, exp) = tokens.GenerateAccessToken(claims);
        var refresh = tokens.GenerateRefreshToken();
        return Ok(new TokenResponse(jwt, refresh, exp));
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public ActionResult<TokenResponse> Refresh([FromBody] RefreshRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.RefreshToken))
            return Unauthorized();

        var claims = new[] { new Claim(ClaimTypes.NameIdentifier, "1"), new Claim(ClaimTypes.Name, "demo") };
        var (jwt, exp) = tokens.GenerateAccessToken(claims);
        var refresh = tokens.GenerateRefreshToken();
        return Ok(new TokenResponse(jwt, refresh, exp));
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me() => Ok(new { user = User.Identity?.Name });
}

public sealed record LoginRequest(string Username, string Password);
public sealed record RefreshRequest(string RefreshToken);
public sealed record TokenResponse(string AccessToken, string RefreshToken, DateTimeOffset ExpiresAt, string TokenType = "Bearer");
