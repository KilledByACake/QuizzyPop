namespace QuizzyPop.Models.Dtos
{
    public sealed class QuizQuestionCreateDto
    {
        public int QuizId { get; set; }

        // Selve spørsmålet
        public string Text { get; set; } = string.Empty;

        // Liste over svaralternativer (minst to)
        public List<string> Choices { get; set; } = new();

        // 0-basert indeks som peker til riktig svar i Choices
        public int CorrectAnswerIndex { get; set; }
    }

    public sealed class QuizQuestionUpdateDto
    {
        public string? Text { get; set; }

        // Hvis satt: erstatter hele Choices-lista
        public List<string>? Choices { get; set; }

        // Hvis satt: ny 0-basert indeks
        public int? CorrectAnswerIndex { get; set; }
    }
}
