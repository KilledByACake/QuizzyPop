using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace QuizzyPop.ViewModels
{
    public class QuizQuestionViewModel
    {
        public int QuestionNumber { get; set; }
        public string Text { get; set; }
        public IFormFile Image { get; set; }
        public List<string> Options { get; set; } = new();
        public int? Points { get; set; }
        public int? TimeLimit { get; set; }
        public string Explanation { get; set; }
        public bool ShuffleAnswers { get; set; }
        public bool Required { get; set; }
    }
}
