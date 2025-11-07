using QuizzyPop.Models;

//deifnerer hvilke operasjoner man kan gjøre på spørsmål i databsen.
//hneter et spørsmål by ID-
//henter alle fra ID
//Legger til spørmsål
//Oppdaterer eksiterende 
//letter Fra ID
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