namespace QuizzyPop.Models;

public class Quiz
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Difficulty { get; set; } = "easy"; // easy, medium, hard

    // Category of the quiz
    public int CategoryId { get; set; }
    public Category? Category { get; set; }


    // Owner of the quiz
    public int UserId { get; set; }
    public User? User { get; set; }
    // Questions in the quiz
    public List<Question> Questions { get; set; } = new();
}