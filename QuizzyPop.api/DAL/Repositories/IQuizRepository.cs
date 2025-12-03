using QuizzyPop.Models;

// Repository abstraction for quizzes and related data (including categories and questions)
namespace QuizzyPop.DAL.Repositories
{
    public interface IQuizRepository
    {
        Task<Quiz?> GetByIdAsync(int id);
        Task<IReadOnlyList<Quiz>> GetAllWithDetailsAsync();
        Task<IReadOnlyList<Category>> GetAllCategoriesAsync();
        Task<Quiz?> GetQuizWithQuestionsAsync(int id);
        Task<Quiz> AddAsync(Quiz quiz, List<int>? tagIds = null);
        Task<bool> UpdateAsync(Quiz quiz);
        Task<bool> DeleteAsync(int id);
    }
}
