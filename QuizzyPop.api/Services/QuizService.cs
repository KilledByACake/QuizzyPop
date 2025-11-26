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

            var questions = quiz.Questions.OrderBy(q => q.Id).ToList();

            int correctCount = 0;
            var messages = new List<string>();

            for (int i = 0; i < questions.Count; i++)
            {
                var q = questions[i];
                int displayNumber = i + 1;

                var answer = submission.Answers
                    .FirstOrDefault(a => a.QuestionId == q.Id);

                if (answer == null)
                {
                    messages.Add($"Question {displayNumber}: no answer");
                    continue;
                }

                bool isCorrect = answer.SelectedIndex == q.CorrectAnswerIndex;

                if (isCorrect)
                {
                    correctCount++;
                    messages.Add($"Question {displayNumber}: correct");
                }
                else
                {
                    string correctChoice = q.Choices[q.CorrectAnswerIndex];
                    string selected = q.Choices.ElementAtOrDefault(answer.SelectedIndex) ?? "?";

                    messages.Add(
                        $"Question {displayNumber}: wrong (your answer: '{selected}', correct: '{correctChoice}')");
                }
            }

            int total = questions.Count;
            int scorePercent = (int)Math.Round((double)correctCount / total * 100);

            return new QuizSubmissionResultDto
            {
                QuizId = quiz.Id,
                QuizTitle = quiz.Title,
                Difficulty = quiz.Difficulty,
                TotalQuestions = total,
                CorrectAnswers = correctCount,
                Score = scorePercent,
                FeedbackMessages = messages
            };
        }
    }
}