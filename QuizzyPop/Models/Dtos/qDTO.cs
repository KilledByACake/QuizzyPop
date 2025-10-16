namespace QuizzyPop.Models.Dtos;

public sealed class QuizCreateDto
{
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
}

public sealed class QuizUpdateDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public bool? Published { get; set; }
}
