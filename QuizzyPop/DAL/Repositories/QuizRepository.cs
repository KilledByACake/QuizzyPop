using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using QuizzyPop.Models;
//implementerer iQuizRepository håndtering av database for Quiz
namespace QuizzyPop.DAL.Repositories
{
    public class QuizRepository : IQuizRepository
    {
        private readonly UserDbContext _context;
        private readonly ILogger<QuizRepository> _logger;

        public QuizRepository(UserDbContext context, ILogger<QuizRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Quiz?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Quiz
                    .Include(q => q.Category)
                    .Include(q => q.User)
                    .FirstOrDefaultAsync(q => q.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to retrieve quiz with ID {QuizId}", id);
                throw;
            }
        }

        public async Task<IReadOnlyList<Quiz>> GetAllWithDetailsAsync()
        {
            try
            {
                return await _context.Quiz
                    .Include(q => q.Category)
                    .Include(q => q.User)
                    .Include(q => q.Questions)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all quizzes with details");
                throw;
            }
        }

        public async Task<IReadOnlyList<Category>> GetAllCategoriesAsync()
        {
            try
            {
                return await _context.Categories.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load categories");
                throw;
            }
        }

        public async Task<Quiz?> GetQuizWithQuestionsAsync(int id)
        {
            try
            {
                return await _context.Quiz
                    .Include(q => q.Category)
                    .Include(q => q.User)
                    .Include(q => q.Questions)
                    .FirstOrDefaultAsync(q => q.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load quiz with questions (QuizId: {QuizId})", id);
                throw;
            }
        }

        public async Task<Quiz> AddAsync(Quiz quiz)
        {
            try
            {
                await _context.Quiz.AddAsync(quiz);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Quiz '{Title}' added (ID: {Id})", quiz.Title, quiz.Id);
                return quiz;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding quiz '{Title}'", quiz.Title);
                throw;
            }
        }

        public async Task<bool> UpdateAsync(Quiz quiz)
        {
            try
            {
                _context.Quiz.Update(quiz);
                var changed = await _context.SaveChangesAsync();
                _logger.LogInformation("Quiz {Id} updated ({Changed} changes)", quiz.Id, changed);
                return changed > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating quiz {Id}", quiz.Id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var quiz = await _context.Quiz.FindAsync(id);
                if (quiz is null)
                {
                    _logger.LogWarning("Tried to delete quiz {Id}, but it does not exist", id);
                    return false;
                }

                _context.Quiz.Remove(quiz);
                var changed = await _context.SaveChangesAsync();
                _logger.LogInformation("Quiz {Id} deleted ({Changed} changes)", id, changed);
                return changed > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting quiz {Id}", id);
                throw;
            }
        }
    }
}
