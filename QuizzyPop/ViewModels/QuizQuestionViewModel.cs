namespace QuizzyPop.ViewModels
{
    public class QuizQuestionViewModel
    {
        // === Core question data ===
        public string Text { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;

        // === Choices / Options ===
        public List<string> Choices { get; set; } = new();      // used by TakingQuiz
        public List<string> Options { get; set; } = new();      // used by CreateQuiz (old partial)
        public int CorrectAnswerIndex { get; set; }

        // === Additional quiz options ===
        public int Points { get; set; } = 1;                    // default 1 point per question
        public int TimeLimit { get; set; } = 0;                 // in seconds; 0 = no limit
        public bool ShuffleAnswers { get; set; } = false;       // randomize order of answers
        public bool Required { get; set; } = true;              // must be answered before next


        public string Explanation { get; set; } = string.Empty;
    }
}
