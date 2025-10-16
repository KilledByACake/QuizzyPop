namespace QuizzyPop.Services;

using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;

public interface IQuizService
{
    Task<Quiz> CreateAsync(QuizCreateDto dto);
    Task<Quiz?> GetAsync(int id);
    Task<IReadOnlyList<Quiz>> ListAsync(bool? published = null);
    Task<bool> UpdateAsync(int id, QuizUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}
