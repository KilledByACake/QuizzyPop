using QuizzyPop.Models;

namespace QuizzyPop.ViewModels
{
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
}