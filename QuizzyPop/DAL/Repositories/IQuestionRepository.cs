using QuizzyPop.Models;


namespace QuizzyPop.DAL.Repositories
{
    public interface IQuestionRepository
    {
        Task<Question?> GetByIdAsync(int id);
        Task<IReadOnlyList<Question>> GetByQuizIdAsync(int quizId);
        Task<Question> AddAsync(Question question);
        Task<bool> UpdateAsync(Question question);
        Task<bool> DeleteAsync(int id); // 🔥 denne MÅ være slik
    }
}