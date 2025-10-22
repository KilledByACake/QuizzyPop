namespace QuizzyPop.Services;

using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;

public interface IQuizQuestionService
{
    Task<QuizQuestion> CreateAsync(QuizQuestionCreateDto dto);
    Task<QuizQuestion?> GetAsync(int id);
    Task<IReadOnlyList<QuizQuestion>> ListByQuizAsync(int quizId);
    Task<bool> UpdateAsync(int id, QuizQuestionUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}
