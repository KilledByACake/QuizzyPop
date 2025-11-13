namespace QuizzyPop.Models.Dtos
{
    public sealed class QuizCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Nytt i modellen
        public string? ImageUrl { get; set; }
        public string Difficulty { get; set; } = "easy"; // "easy", "medium", "hard"

        // Relasjoner
        public int CategoryId { get; set; }
        public int? UserId { get; set; }
    }

    public sealed class QuizUpdateDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? Difficulty { get; set; } // "easy", "medium", "hard"

        // Tillater endring av kategori/bruker ved behov
        public int? CategoryId { get; set; }
        public int? UserId { get; set; }
    }
}
