using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace QuizzyPop.ViewModels
{
    public class QuizMetaDataViewModel
    {
        [Required, StringLength(120)]
        public string Title { get; set; }

        [StringLength(2000)]
        public string Description { get; set; }

        [StringLength(80)]
        public string Category { get; set; }

        [Required]
        public string Difficulty { get; set; }

        [Range(0, 600)]
        public int? TimeLimit { get; set; }

        public string Tags { get; set; }

        public bool IsPublic { get; set; }

        public List<QuizQuestionViewModel> Questions { get; set; } = new List<QuizQuestionViewModel>();
    }
}
