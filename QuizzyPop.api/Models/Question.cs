namespace QuizzyPop.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;

        // NEW: Question type field
        public string Type { get; set; } = "multiple-choice"; // default

        // For multiple-choice, multi-select
        public List<string> Choices { get; set; } = new(); 
        public int CorrectAnswerIndex { get; set; }

        // NEW: For multi-select questions
        public List<int> CorrectAnswerIndexes { get; set; } = new();

        // NEW: For true/false questions
        public bool? CorrectBool { get; set; }

        // NEW: For fill-blank, short, long answer questions
        public string? CorrectAnswer { get; set; }

        // Which Quiz this question belongs to
        public int QuizId { get; set; }
        public virtual Quiz Quiz { get; set; } = null!;
    }
}