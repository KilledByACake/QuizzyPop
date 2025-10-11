namespace QuizzyPop.Models;

public class Question
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string CorrectAnswer { get; set; } = string.Empty;
    public List<string> Options { get; set; } = new(); 
    
    
    // Which quiz this question belongs to
    public int QuizId { get; set; }
}