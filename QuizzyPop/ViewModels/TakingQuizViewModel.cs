namespace QuizzyPop.ViewModels
{
    public class TakingQuizViewModel
    {
        public int QuizId { get; set; }
        public string Title { get; set; } = string.Empty;

        // The current index of the question the user is on (0-based)
        public int CurrentQuestionIndex { get; set; }

        // A 1-based display number for the current question (used in the view)
        public int CurrentQuestionNumber => CurrentQuestionIndex + 1;

        // Total number of questions in this quiz
        public int TotalQuestions { get; set; }

        // The question currently being shown
        public QuizQuestionViewModel CurrentQuestion { get; set; } = new QuizQuestionViewModel();

        // Navigation helpers for "Next" and "Previous" buttons
        public bool HasNext => CurrentQuestionIndex < TotalQuestions - 1;
        public bool HasPrevious => CurrentQuestionIndex > 0;
    }
}
