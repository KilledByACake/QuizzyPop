namespace QuizzyPop.Models;

public class RefreshToken
{
    public int Id { get; set; }
    public string Token { get; set; } = "";
    public DateTimeOffset ExpiresAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? RevokedAt { get; set; }

    public bool IsActive => RevokedAt is null && DateTimeOffset.UtcNow < ExpiresAt;

    public int UserId { get; set; }
    public User? User { get; set; }
}
