using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using QuizzyPop.Models;

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
                return await _context.Quiz.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to retrieve quiz with ID {QuizId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<Quiz>> GetAllWithDetailsAsync()
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

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
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
                    .Include(q => q.Questions)
                    .FirstOrDefaultAsync(q => q.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load quiz with questions (QuizId: {QuizId})", id);
                throw;
            }
        }

        public async Task AddAsync(Quiz quiz)
        {
            try
            {
                await _context.Quiz.AddAsync(quiz);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Quiz '{Title}' added successfully (ID: {Id})", quiz.Title, quiz.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding quiz '{Title}'", quiz.Title);
                throw;
            }
        }
    }
}
