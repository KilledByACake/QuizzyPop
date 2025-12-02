namespace QuizzyPop.Models.Dtos
{
    public sealed class QuizSubmissionDto
    {
        public List<QuizSubmissionAnswerDto> Answers { get; set; } = new();
    }

    public sealed class QuizSubmissionAnswerDto
    {
        public int QuestionId { get; set; }
        public int SelectedChoiceIndex { get; set; }
    }

    public sealed class QuizSubmissionResultDto
    {
        public int Score { get; set; }
        public int CorrectAnswers { get; set; }
        public int TotalQuestions { get; set; }
        public string Difficulty { get; set; } = "unknown";
        public List<string> FeedbackMessages { get; set; } = new();
    }
}