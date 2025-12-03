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
                    questionNumber++;
                    continue;
                }

                bool isCorrect = false;
                string feedbackMsg;

                switch (q.Type)
                {
                    case "multiple-choice":
                        if (answer.SelectedChoiceIndex.HasValue &&
                            answer.SelectedChoiceIndex.Value == q.CorrectAnswerIndex)
                        {
                            isCorrect = true;
                            feedbackMsg = $"Question {questionNumber}: correct";
                        }
                        else
                        {
                            string correctText = q.Choices.ElementAtOrDefault(q.CorrectAnswerIndex) ?? "unknown";
                            string selectedText = answer.SelectedChoiceIndex.HasValue
                                ? q.Choices.ElementAtOrDefault(answer.SelectedChoiceIndex.Value) ?? "invalid"
                                : "none";
                            feedbackMsg = $"Question {questionNumber}: wrong (your answer: '{selectedText}', correct answer: '{correctText}')";
                        }
                        break;

                    case "multi-select":
                        if (answer.SelectedChoiceIndexes != null && q.CorrectAnswerIndexes != null)
                        {
                            var userAnswers = answer.SelectedChoiceIndexes.OrderBy(x => x).ToList();
                            var correctAnswers = q.CorrectAnswerIndexes.OrderBy(x => x).ToList();

                            if (userAnswers.SequenceEqual(correctAnswers))
                            {
                                isCorrect = true;
                                feedbackMsg = $"Question {questionNumber}: correct";
                            }
                            else
                            {
                                var correctTexts = correctAnswers.Select(i => q.Choices.ElementAtOrDefault(i) ?? "?");
                                var selectedTexts = userAnswers.Select(i => q.Choices.ElementAtOrDefault(i) ?? "?");
                                feedbackMsg = $"Question {questionNumber}: wrong (your answers: {string.Join(", ", selectedTexts)}, correct answers: {string.Join(", ", correctTexts)})";
                            }
                        }
                        else
                        {
                            feedbackMsg = $"Question {questionNumber}: wrong (invalid or no answer)";
                        }
                        break;

                    case "true-false":
                        if (answer.SelectedBool.HasValue && q.CorrectBool.HasValue &&
                            answer.SelectedBool.Value == q.CorrectBool.Value)
                        {
                            isCorrect = true;
                            feedbackMsg = $"Question {questionNumber}: correct";
                        }
                        else
                        {
                            string userAnswer = answer.SelectedBool.HasValue ? (answer.SelectedBool.Value ? "True" : "False") : "none";
                            string correctAnswer = q.CorrectBool.HasValue ? (q.CorrectBool.Value ? "True" : "False") : "unknown";
                            feedbackMsg = $"Question {questionNumber}: wrong (your answer: {userAnswer}, correct answer: {correctAnswer})";
                        }
                        break;

                    case "fill-blank":
                    case "short":
                    case "long":
                        if (!string.IsNullOrWhiteSpace(answer.EnteredAnswer) &&
                            !string.IsNullOrWhiteSpace(q.CorrectAnswer) &&
                            string.Equals(answer.EnteredAnswer.Trim(), q.CorrectAnswer.Trim(), StringComparison.OrdinalIgnoreCase))
                        {
                            isCorrect = true;
                            feedbackMsg = $"Question {questionNumber}: correct";
                        }
                        else
                        {
                            string userAnswer = answer.EnteredAnswer ?? "none";
                            string correctAnswer = q.CorrectAnswer ?? "unknown";
                            feedbackMsg = $"Question {questionNumber}: wrong (your answer: '{userAnswer}', correct answer: '{correctAnswer}')";
                        }
                        break;

                    default:
                        feedbackMsg = $"Question {questionNumber}: unknown question type '{q.Type}'";
                        break;
                }

                if (isCorrect) correctCount++;
                messages.Add(feedbackMsg);
                questionNumber++;
            }

            return new QuizSubmissionResultDto
            {
                Score = total > 0 ? (int)((double)correctCount / total * 100) : 0,
                CorrectAnswers = correctCount,
                TotalQuestions = total,
                Difficulty = quiz.Difficulty,
                FeedbackMessages = messages
            };
        }
    }
}