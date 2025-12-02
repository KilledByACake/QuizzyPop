using QuizzyPop.DAL.Repositories;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;
using Microsoft.Extensions.Logging;

namespace QuizzyPop.Services
{
    // Service-lag for Quiz: forretningslogikk + koordinering mot repository
    public sealed class QuizService : IQuizService
    {
        private readonly IQuizRepository _repo;
        private readonly ILogger<QuizService> _logger;

        // Avhengighetsinjeksjon av repository og logger
        public QuizService(IQuizRepository repo, ILogger<QuizService> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        public async Task<Quiz> CreateAsync(QuizCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ArgumentException("Title is required", nameof(dto.Title));

            var entity = new Quiz
            {
                Title = dto.Title.Trim(),
                Description = dto.Description ?? string.Empty,
                ImageUrl = dto.ImageUrl ?? string.Empty,
                Difficulty = string.IsNullOrWhiteSpace(dto.Difficulty) ? "easy" : dto.Difficulty.Trim(),
                CategoryId = dto.CategoryId,
                UserId = dto.UserId
            };

            _logger.LogInformation("Creating quiz with title {Title}", entity.Title);
            var created = await _repo.AddAsync(entity);
            _logger.LogInformation("Created quiz with id {Id}", created.Id);
            return created;
        }

        public Task<Quiz?> GetAsync(int id) => _repo.GetByIdAsync(id);

        public Task<Quiz?> GetWithQuestionsAsync(int id) => _repo.GetQuizWithQuestionsAsync(id);

        public async Task<IReadOnlyList<Quiz>> ListAsync() => await _repo.GetAllWithDetailsAsync();

        public async Task<IReadOnlyList<Category>> ListCategoriesAsync() => await _repo.GetAllCategoriesAsync();

        public async Task<bool> UpdateAsync(int id, QuizUpdateDto dto)
        {
            var quiz = await _repo.GetByIdAsync(id);
            if (quiz is null)
            {
                _logger.LogWarning("Quiz {Id} not found for update", id);
                return false;
            }

            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ArgumentException("Title is required", nameof(dto.Title));

            quiz.Title = dto.Title.Trim();
            quiz.Description = dto.Description ?? string.Empty;
            quiz.ImageUrl = dto.ImageUrl ?? string.Empty;
            quiz.Difficulty = string.IsNullOrWhiteSpace(dto.Difficulty)
                ? quiz.Difficulty
                : dto.Difficulty.Trim();
            quiz.CategoryId = dto.CategoryId;

            await _repo.UpdateAsync(quiz);
            _logger.LogInformation("Quiz {Id} updated", quiz.Id);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var deleted = await _repo.DeleteAsync(id);
            if (!deleted)
                _logger.LogWarning("Quiz {Id} not found for delete", id);
            else
                _logger.LogInformation("Quiz {Id} deleted", id);
            return deleted;
        }

        public async Task<QuizSubmissionResultDto> SubmitAsync(int quizId, QuizSubmissionDto submission)
{
        var quiz = await _repo.GetQuizWithQuestionsAsync(quizId);
        if (quiz == null)
            throw new ArgumentException($"Quiz {quizId} not found");

        int correctCount = 0;
        int total = quiz.Questions.Count;
        var messages = new List<string>();

        int questionNumber = 1;
        foreach (var q in quiz.Questions)
        {
            var answer = submission.Answers.FirstOrDefault(a => a.QuestionId == q.Id);

            if (answer == null)
            {
                messages.Add($"Question {questionNumber}: no answer");
            }
            else if (answer.SelectedChoiceIndex == q.CorrectAnswerIndex)
            {
                correctCount++;
                messages.Add($"Question {questionNumber}: correct");
            }
            else
            {
                string correctText = q.Choices.ElementAtOrDefault(q.CorrectAnswerIndex) ?? "unknown";
                string selectedText = q.Choices.ElementAtOrDefault(answer.SelectedChoiceIndex) ?? "invalid";
                messages.Add($"Question {questionNumber}: wrong (your answer: '{selectedText}', correct answer: '{correctText}')");
            }

            questionNumber++;
        }

        // Return result using only properties present in QuizSubmissionResultDto
        return new QuizSubmissionResultDto
        {
            Score = total > 0 ? (int)((double)correctCount / total * 100) : 0,
            CorrectAnswers = correctCount,
            TotalQuestions = total,
            FeedbackMessages = messages
        };
    }
    }
}