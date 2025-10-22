using QuizzyPop.Models;

namespace QuizzyPop.DAL.Repositories
{
    public interface IQuizRepository
    {
        Task<Quiz?> GetByIdAsync(int id);
        Task<IEnumerable<Quiz>> GetAllWithDetailsAsync();
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<Quiz?> GetQuizWithQuestionsAsync(int id);
        Task AddAsync(Quiz quiz);
    }
}
