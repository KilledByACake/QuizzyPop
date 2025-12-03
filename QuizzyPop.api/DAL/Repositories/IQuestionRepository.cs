using QuizzyPop.Models;

// Repository abstraction for CRUD operations on quiz questions
namespace QuizzyPop.DAL.Repositories
{
    public interface IQuestionRepository
    {
        Task<Question?> GetByIdAsync(int id);
        Task<IReadOnlyList<Question>> GetByQuizIdAsync(int quizId);
        Task<Question> AddAsync(Question question);
        Task<bool> UpdateAsync(Question question);
        Task<bool> DeleteAsync(int id);
    }
}