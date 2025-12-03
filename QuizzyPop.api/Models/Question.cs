namespace QuizzyPop.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;

        // Question type, e.g. "multiple-choice", "multi-select", "true-false"
        public string Type { get; set; } = "multiple-choice";

        // Options shown for choice-based questions
        public List<string> Choices { get; set; } = new(); 

        // Index for single-answer multiple-choice questions
        public int CorrectAnswerIndex { get; set; }

        // Indexes for multi-select questions
        public List<int> CorrectAnswerIndexes { get; set; } = new();

        // Expected value for true/false questions
        public bool? CorrectBool { get; set; }

        // Expected text answer for fill-in / short / long answer questions
        public string? CorrectAnswer { get; set; }

        // Owning quiz
        public int QuizId { get; set; }
        public virtual Quiz Quiz { get; set; } = null!;
    }
}