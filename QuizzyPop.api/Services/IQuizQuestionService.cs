namespace QuizzyPop.Services;

using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;

// Service abstraction for quiz question business logic (implemented by QuizQuestionService)
public interface IQuizQuestionService
{
    Task<Question> CreateAsync(QuizQuestionCreateDto dto);
    Task<Question?> GetAsync(int id);
    Task<IReadOnlyList<Question>> ListByQuizAsync(int quizId);
    Task<bool> UpdateAsync(int id, QuizQuestionUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}
