namespace QuizzyPop.Models.Dtos
{
    public sealed class QuizSubmissionDto
    {
        public List<QuizSubmissionAnswerDto> Answers { get; set; } = new();
    }

    public sealed class QuizSubmissionAnswerDto
    {
        public int QuestionId { get; set; }
        public int SelectedIndex { get; set; }
    }

    public sealed class QuizSubmissionResultDto
    {
        public int Score { get; set; }
        public int CorrectAnswers { get; set; }
        public int TotalQuestions { get; set; }
        public List<string> FeedbackMessages { get; set; } = new();
    }
}