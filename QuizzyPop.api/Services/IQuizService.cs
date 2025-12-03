using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;

namespace QuizzyPop.Services
{
    // Service abstraction for quiz operations (CRUD, listing, submission)
    public interface IQuizService
    {
        Task<Quiz> CreateAsync(QuizCreateDto dto);
        Task<Quiz?> GetAsync(int id);
        Task<Quiz?> GetWithQuestionsAsync(int id);
        Task<IReadOnlyList<Quiz>> ListAsync();                 // Uses GetAllWithDetailsAsync in the repository
        Task<IReadOnlyList<Category>> ListCategoriesAsync();   // Uses GetAllCategoriesAsync in the repository
        Task<bool> UpdateAsync(int id, QuizUpdateDto dto);
        Task<bool> DeleteAsync(int id);

        Task<QuizSubmissionResultDto> SubmitAsync(int quizId, QuizSubmissionDto dto);
    }
}
