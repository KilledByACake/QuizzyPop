namespace QuizzyPop.Models.Dtos;

public sealed record RegisterRequest(string Username, string Email, string Password);

public sealed record LoginRequest(string Username, string Password);

public sealed record RefreshRequest(string RefreshToken);

public sealed record TokenResponse(string AccessToken, string RefreshToken, DateTimeOffset ExpiresAt, string TokenType = "Bearer");