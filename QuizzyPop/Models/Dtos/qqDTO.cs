namespace QuizzyPop.Models.Dtos;

public sealed class QuizQuestionCreateDto
{
    public int QuizId { get; set; }
    public string Text { get; set; } = default!;
    public string? OptionA { get; set; }
    public string? OptionB { get; set; }
    public string? OptionC { get; set; }
    public string? OptionD { get; set; }
    public string? CorrectOption { get; set; } // f.eks. "A", "B", "C", "D"
}

public sealed class QuizQuestionUpdateDto
{
    public string? Text { get; set; }
    public string? OptionA { get; set; }
    public string? OptionB { get; set; }
    public string? OptionC { get; set; }
    public string? OptionD { get; set; }
    public string? CorrectOption { get; set; }
}
