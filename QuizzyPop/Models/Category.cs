namespace QuizzyPop.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Quizzes in this category
    public List<Quiz> Quizzes { get; set; } = new();
}
