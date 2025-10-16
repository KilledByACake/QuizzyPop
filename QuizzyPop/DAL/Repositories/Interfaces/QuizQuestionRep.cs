namespace QuizzyPop.DAL.Repositories.Interfaces;

using QuizzyPop.Models;

public interface IQuizQuestionRepository
{
    Task<Question?> GetByIdAsync(int id);
    Task<IReadOnlyList<Question>> GetByQuizIdAsync(int quizId);
    Task<Question> AddAsync(Question entity);
    Task<bool> UpdateAsync(Question entity);
    Task<bool> DeleteAsync(int id);
}
