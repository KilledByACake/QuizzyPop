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
                    .Include(q => q.Tags)
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
                    .Include(q => q.Tags)
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
                    .Include(q => q.Tags)
                    .AsTracking()
                    .FirstOrDefaultAsync(q => q.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load quiz with questions (QuizId: {QuizId})", id);
                throw;
            }
        }

        public async Task<Quiz> AddAsync(Quiz quiz, List<int>? tagIds = null)
        {
            if (tagIds != null && tagIds.Any())
            {
                quiz.Tags = await _context.Tags
                    .Where(t => tagIds.Contains(t.Id))
                    .ToListAsync();
            }

            await _context.Quiz.AddAsync(quiz);
            await _context.SaveChangesAsync();
            return quiz;
        }


        public async Task<bool> UpdateAsync(Quiz quiz)
        {
            _context.Quiz.Update(quiz);
            var changed = await _context.SaveChangesAsync();
            return changed > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var quiz = await _context.Quiz.FindAsync(id);
            if (quiz is null)
                return false;

            _context.Quiz.Remove(quiz);
            var changed = await _context.SaveChangesAsync();
            return changed > 0;
        }
    }
}
