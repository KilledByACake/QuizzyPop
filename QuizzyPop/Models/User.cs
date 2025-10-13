namespace QuizzyPop.Models;

public class User
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public DateTime CreatedAt { get; set; }
    public int QuizzesCreated { get; set; }
    public int QuizzesTaken { get; set; }
}