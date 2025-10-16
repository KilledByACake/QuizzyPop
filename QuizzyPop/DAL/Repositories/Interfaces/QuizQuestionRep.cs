namespace QuizzyPop.DAL.Repositories.Interfaces;

using QuizzyPop.Models;

public interface IQuizQuestionRepository
{
    Task<QuizQuestion?> GetByIdAsync(int id);
    Task<IReadOnlyList<QuizQuestion>> GetByQuizIdAsync(int quizId);
    Task<QuizQuestion> AddAsync(QuizQuestion entity);
    Task<bool> UpdateAsync(QuizQuestion entity);
    Task<bool> DeleteAsync(int id);
}
