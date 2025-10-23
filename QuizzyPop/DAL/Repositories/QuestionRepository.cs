using System.Linq;
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

        public async Task<IReadOnlyList<Question>> GetByQuizIdAsync(int quizId)
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

        public async Task<Question> AddAsync(Question question)
        {
            try
            {
                await _context.Questions.AddAsync(question);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Question added to quiz {QuizId} with Id {Id}", question.QuizId, question.Id);
                return question; // EF setter Id etter SaveChanges
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding question for quiz {QuizId}", question.QuizId);
                throw;
            }
        }

        public async Task<bool> UpdateAsync(Question question)
        {
            try
            {
                _context.Questions.Update(question);
                var changed = await _context.SaveChangesAsync();
                _logger.LogInformation("Question {Id} updated ({Changed} changes)", question.Id, changed);
                return changed > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating question {Id}", question.Id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var question = await _context.Questions.FindAsync(id);
                if (question is null)
                {
                    _logger.LogWarning("Tried to delete question {Id}, but it does not exist", id);
                    return false;
                }

                _context.Questions.Remove(question);
                var changed = await _context.SaveChangesAsync();
                _logger.LogInformation("Question {Id} deleted ({Changed} changes)", id, changed);
                return changed > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting question {Id}", id);
                throw;
            }
        }
    }
}
