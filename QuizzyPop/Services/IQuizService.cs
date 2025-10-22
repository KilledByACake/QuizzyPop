namespace QuizzyPop.Services;

using QuizzyPop.DAL.Repositories.Interfaces;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;
using Microsoft.Extensions.Logging;

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
            Description = dto.Description,
            Published = false,
            CreatedAt = DateTime.UtcNow
        };
        return await _repo.AddAsync(entity);
    }

    public Task<Quiz?> GetAsync(int id) => _repo.GetByIdAsync(id);

    public async Task<IReadOnlyList<Quiz>> ListAsync(bool? published = null)
    {
        var all = await _repo.GetAllAsync();
        return published is null ? all : all.Where(q => q.Published == published).ToList();
    }

    public async Task<bool> UpdateAsync(int id, QuizUpdateDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing is null) return false;

        if (!string.IsNullOrWhiteSpace(dto.Title)) existing.Title = dto.Title.Trim();
        if (dto.Description is not null) existing.Description = dto.Description;
        if (dto.Published is not null) existing.Published = dto.Published.Value;

        return await _repo.UpdateAsync(existing);
    }

    public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);
}
