using QuizzyPop.Models;


//struktur for quiz-objekter
namespace QuizzyPop.DAL.Repositories
{
    public interface IQuizRepository
    {
        Task<Quiz?> GetByIdAsync(int id);
        Task<IReadOnlyList<Quiz>> GetAllWithDetailsAsync();
        Task<IReadOnlyList<Category>> GetAllCategoriesAsync();
        Task<Quiz?> GetQuizWithQuestionsAsync(int id);
        Task<Quiz> AddAsync(Quiz quiz);
        Task<bool> UpdateAsync(Quiz quiz);
        Task<bool> DeleteAsync(int id);
    }
}
