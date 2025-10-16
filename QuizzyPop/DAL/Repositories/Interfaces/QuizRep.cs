namespace QuizzyPop.DAL.Repositories.Interfaces;

using QuizzyPop.Models;

public interface IQuizRepository
{
    Task<Quiz?> GetByIdAsync(int id);
    Task<IReadOnlyList<Quiz>> GetAllAsync();
    Task<Quiz> AddAsync(Quiz entity);
    Task<bool> UpdateAsync(Quiz entity);
    Task<bool> DeleteAsync(int id);
}
