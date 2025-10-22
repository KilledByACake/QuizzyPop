using QuizzyPop.Models;

namespace QuizzyPop.DAL.Repositories
{
    public interface IQuestionRepository
    {
        Task<Question?> GetByIdAsync(int id);
        Task<IEnumerable<Question>> GetByQuizIdAsync(int quizId);
        Task AddAsync(Question question);
        Task UpdateAsync(Question question);
        Task DeleteAsync(int id);
    }
}
