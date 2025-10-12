namespace QuizzyPop.Models

{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public string CorrectAnswer { get; set; } = string.Empty;
        public string AnswerExplanation { get; set; } = string.Empty;

        // Which Quiz this question belongs to
        public int QuizId { get; set; }
        public virtual Quiz Quiz { get; set; } = null!;
    }
}