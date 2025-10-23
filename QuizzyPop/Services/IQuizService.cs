using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;

namespace QuizzyPop.Services
{
    public interface IQuizService
    {
        Task<Quiz> CreateAsync(QuizCreateDto dto);
        Task<Quiz?> GetAsync(int id);
        Task<Quiz?> GetWithQuestionsAsync(int id);
        Task<IReadOnlyList<Quiz>> ListAsync();                 // bruker GetAllWithDetailsAsync
        Task<IReadOnlyList<Category>> ListCategoriesAsync();   // bruker GetAllCategoriesAsync
    }
}
