namespace QuizzyPop.ViewModels
{
    public class QuizResultViewModel
    {
        public string QuizTitle { get; set; } = string.Empty;
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public int Score => (int)((double)CorrectAnswers / TotalQuestions * 100);
        public string Difficulty { get; set; } = "Medium";
        public List<string>? FeedbackMessages { get; set; }
    }
}
