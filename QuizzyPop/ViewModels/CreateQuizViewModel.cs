using System.Collections.Generic;

namespace QuizzyPop.ViewModels
{
    public class CreateQuizViewModel
    {
        public QuizMetaDataViewModel MetaData { get; set; } = new();
        public List<QuizQuestionViewModel> Questions { get; set; } = new();
    }
}
