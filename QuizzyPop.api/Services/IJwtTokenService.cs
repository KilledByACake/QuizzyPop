using System.Security.Claims;

namespace QuizzyPop.Services;

public interface IJwtTokenService
{
    (string token, DateTimeOffset expires) GenerateAccessToken(IEnumerable<Claim> claims);
    string GenerateRefreshToken();
}
