using QuizzyPop.Models;
using System.ComponentModel.DataAnnotations;

namespace QuizzyPop.ViewModels
{
    public class QuizListViewModel
    {
        public List<QuizMetaDataViewModel> Quizzes { get; set; } = new();
    }
    
    public class ItemsViewModel
    {
        public IEnumerable<User>? Users;
        public string? CurrentViewName;

        public ItemsViewModel(IEnumerable<User>? users, string? currentViewName)
        {
            Users = users;
            CurrentViewName = currentViewName;
        }
    }
    
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address")]
        [Display(Name = "Email")]
        public string Email { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Password is required")]
        [Display(Name = "Password")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
    }
}