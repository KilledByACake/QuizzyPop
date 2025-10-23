using QuizzyPop.DAL.Repositories;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;
using Microsoft.Extensions.Logging;

namespace QuizzyPop.Services
{
    public sealed class QuizService : IQuizService
    {
        private readonly IQuizRepository _repo;
        private readonly ILogger<QuizService> _logger;

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
    }
}
