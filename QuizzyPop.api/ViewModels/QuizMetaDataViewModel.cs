using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;  // Add this line

namespace QuizzyPop.ViewModels
{
    // View model for quiz metadata, settings, and associated questions in MVC views
    public class QuizMetaDataViewModel
    {
        public int Id { get; set; }

        [Required, StringLength(120)]
        public string Title { get; set; } = string.Empty;

        [StringLength(2000)]
        public string Description { get; set; } = string.Empty;

        [StringLength(80)]
        public string? Category { get; set; }

        [Required]
        public string Difficulty { get; set; } = string.Empty;

        [Range(0, 600)]
        public int? TimeLimit { get; set; }
        public int CategoryId { get; set; } 
        public string? Tags { get; set; }
        public bool IsPublic { get; set; }
        public IFormFile? CoverImage { get; set; }

        public List<QuizQuestionViewModel> Questions { get; set; } = new List<QuizQuestionViewModel>();
    }
}
