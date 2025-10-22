using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using QuizzyPop.Models;

namespace QuizzyPop.DAL.Repositories
{
    public class QuestionRepository : IQuestionRepository
    {
        private readonly UserDbContext _context;
        private readonly ILogger<QuestionRepository> _logger;

        public QuestionRepository(UserDbContext context, ILogger<QuestionRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Question?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Questions.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to retrieve question with ID {QuestionId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<Question>> GetByQuizIdAsync(int quizId)
        {
            try
            {
                return await _context.Questions
                    .Where(q => q.QuizId == quizId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to retrieve questions for quiz {QuizId}", quizId);
                throw;
            }
        }

        public async Task AddAsync(Question question)
        {
            try
            {
                await _context.Questions.AddAsync(question);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Question added to quiz {QuizId}", question.QuizId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding question for quiz {QuizId}", question.QuizId);
                throw;
            }
        }

        public async Task UpdateAsync(Question question)
        {
            try
            {
                _context.Questions.Update(question);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Question {Id} updated successfully", question.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating question {Id}", question.Id);
                throw;
            }
        }

        public async Task DeleteAsync(int id)
        {
            try
            {
                var question = await _context.Questions.FindAsync(id);
                if (question != null)
                {
                    _context.Questions.Remove(question);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Question {Id} deleted successfully", id);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting question {Id}", id);
                throw;
            }
        }
    }
}
