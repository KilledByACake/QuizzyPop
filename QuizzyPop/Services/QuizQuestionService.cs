namespace QuizzyPop.Services;

using System.Linq;
using Microsoft.Extensions.Logging;
using QuizzyPop.DAL.Repositories;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;

//imput validering + normalisering
public sealed class QuizQuestionService : IQuizQuestionService
{
    //Crud og Verfisering
    private readonly IQuestionRepository _repo;
    private readonly IQuizRepository _quizRepo;
    private readonly ILogger<QuizQuestionService> _logger;

    public QuizQuestionService(
        IQuestionRepository repo,
        IQuizRepository quizRepo,
        ILogger<QuizQuestionService> logger)
    {
        _repo = repo;
        _quizRepo = quizRepo;
        _logger = logger;
    }
    //nytt sorlsmål for quiz
    public async Task<Question> CreateAsync(QuizQuestionCreateDto dto)
    {
        if (dto.QuizId <= 0) throw new ArgumentException("QuizId is required", nameof(dto.QuizId));
        if (string.IsNullOrWhiteSpace(dto.Text)) throw new ArgumentException("Text is required", nameof(dto.Text));

        // Normaliser choices: trim og fjern tomme
        var normalized = (dto.Choices ?? new())
            .Select(c => c?.Trim() ?? string.Empty)
            .Where(c => !string.IsNullOrWhiteSpace(c))
            .ToList();

        if (normalized.Count < 2)
            throw new ArgumentException("Provide at least two choices.", nameof(dto.Choices));

        if (dto.CorrectAnswerIndex < 0 || dto.CorrectAnswerIndex >= normalized.Count)
            throw new ArgumentOutOfRangeException(nameof(dto.CorrectAnswerIndex),
                "CorrectAnswerIndex must be a valid index into Choices.");

        var quiz = await _quizRepo.GetByIdAsync(dto.QuizId);
        if (quiz is null) throw new InvalidOperationException($"Quiz {dto.QuizId} not found");

        var entity = new Question
        {
            QuizId = dto.QuizId,
            Text = dto.Text.Trim(),
            Choices = normalized,
            CorrectAnswerIndex = dto.CorrectAnswerIndex,
        };

        // Hvis IQuestionRepository.AddAsync ikke returnerer entity, gjør vi slik:
        await _repo.AddAsync(entity);
        return entity;
        // Hvis AddAsync faktisk returnerer Question hos deg, kan du bytte til:
        // return await _repo.AddAsync(entity);
    }

    public Task<Question?> GetAsync(int id) => _repo.GetByIdAsync(id);

    public Task<IReadOnlyList<Question>> ListByQuizAsync(int quizId)
        => _repo.GetByQuizIdAsync(quizId);

    public async Task<bool> UpdateAsync(int id, QuizQuestionUpdateDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing is null) return false;

        if (!string.IsNullOrWhiteSpace(dto.Text))
            existing.Text = dto.Text.Trim();

        if (dto.Choices is not null)
        {
            var normalized = dto.Choices
                .Select(c => c?.Trim() ?? string.Empty)
                .Where(c => !string.IsNullOrWhiteSpace(c))
                .ToList();

            if (normalized.Count < 2)
                throw new ArgumentException("Provide at least two choices.", nameof(dto.Choices));

            existing.Choices = normalized;

            // Sørg for at korrekt indeks fortsatt er gyldig om den ikke eksplisitt settes
            if (existing.CorrectAnswerIndex < 0 || existing.CorrectAnswerIndex >= existing.Choices.Count)
            {
                existing.CorrectAnswerIndex = 0; // fallback
            }
        }

        if (dto.CorrectAnswerIndex is not null)
        {
            var idx = dto.CorrectAnswerIndex.Value;
            if (idx < 0 || idx >= existing.Choices.Count)
                throw new ArgumentOutOfRangeException(nameof(dto.CorrectAnswerIndex),
                    "CorrectAnswerIndex must be a valid index into Choices.");
            existing.CorrectAnswerIndex = idx;
        }

        return await _repo.UpdateAsync(existing);
    }

    public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);
}
