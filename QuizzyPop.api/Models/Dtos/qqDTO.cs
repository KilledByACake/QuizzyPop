namespace QuizzyPop.Models.Dtos
{
    public sealed class QuizQuestionCreateDto
    {
        public int QuizId { get; set; }
        public string Text { get; set; } = string.Empty;

        // NEW: Question type
        public string Type { get; set; } = "multiple-choice";

        // For multiple-choice, multi-select (optional now)
        public List<string>? Choices { get; set; }
        public int? CorrectAnswerIndex { get; set; }

        // NEW: For multi-select
        public List<int>? CorrectAnswerIndexes { get; set; }

        // NEW: For true/false
        public bool? CorrectBool { get; set; }

        // NEW: For text answers
        public string? CorrectAnswer { get; set; }
        
    }

    public sealed class QuizQuestionUpdateDto
    {
        public string? Text { get; set; }
        public string? Type { get; set; }

        public List<string>? Choices { get; set; }
        public int? CorrectAnswerIndex { get; set; }
        public List<int>? CorrectAnswerIndexes { get; set; }
        public bool? CorrectBool { get; set; }
        public string? CorrectAnswer { get; set; }
    }
}
