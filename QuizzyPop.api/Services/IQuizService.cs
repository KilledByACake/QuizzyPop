using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;


//tjenestegrensesnitt for Qiiuz
namespace QuizzyPop.Services
{
    //service layer rdunt quiz
    public interface IQuizService
    {
        Task<Quiz> CreateAsync(QuizCreateDto dto);
        Task<Quiz?> GetAsync(int id);
        Task<Quiz?> GetWithQuestionsAsync(int id);
        Task<IReadOnlyList<Quiz>> ListAsync();                 // bruker GetAllWithDetailsAsync
        Task<IReadOnlyList<Category>> ListCategoriesAsync();   // bruker GetAllCategoriesAsync
    }
}
