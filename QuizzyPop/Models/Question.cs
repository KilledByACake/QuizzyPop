namespace QuizzyPop.Models

{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;

        public List<string> Choices { get; set; } = new(); 
        public int CorrectAnswerIndex { get; set; }

        // Which Quiz this question belongs to
        public int QuizId { get; set; }
        public virtual Quiz Quiz { get; set; } = null!;
    }
}