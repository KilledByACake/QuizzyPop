namespace QuizzyPop.Models.Dtos;

public sealed record RegisterRequest(string Email, string Password, string? Role);

public sealed record LoginRequest(string Email, string Password);

public sealed record RefreshRequest(string RefreshToken);

public sealed record TokenResponse(string AccessToken, string RefreshToken, DateTimeOffset ExpiresAt, string TokenType = "Bearer");