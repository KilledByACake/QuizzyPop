namespace QuizzyPop.Services;

using System.Linq;
using Microsoft.Extensions.Logging;
using QuizzyPop.DAL.Repositories;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;

// Service for quiz question validation, normalization and persistence
public sealed class QuizQuestionService : IQuizQuestionService
{
    // Repositories and logging for CRUD and diagnostics
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
    // Create a new question for a quiz based on the requested question type
    public async Task<Question> CreateAsync(QuizQuestionCreateDto dto)
    {
        var question = new Question
        {
            QuizId = dto.QuizId,
            Text = dto.Text,
            Type = dto.Type
        };

        // Set fields based on question type
        switch (dto.Type)
        {
            case "multiple-choice":
                question.Choices = dto.Choices ?? new();
                question.CorrectAnswerIndex = dto.CorrectAnswerIndex ?? 0;
                break;
            
            case "multi-select":
                question.Choices = dto.Choices ?? new();
                question.CorrectAnswerIndexes = dto.CorrectAnswerIndexes ?? new();
                break;
            
            case "true-false":
                question.CorrectBool = dto.CorrectBool;
                break;
            
            case "fill-blank":
            case "short":
            case "long":
                question.CorrectAnswer = dto.CorrectAnswer;
                break;
        }

        return await _repo.AddAsync(question);
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

        if (!string.IsNullOrWhiteSpace(dto.Type))
            existing.Type = dto.Type.Trim();

        // Update fields based on question type
        switch (existing.Type)
        {
            case "multiple-choice":
                if (dto.Choices is not null)
                {
                    var normalized = dto.Choices
                        .Select(c => c?.Trim() ?? string.Empty)
                        .Where(c => !string.IsNullOrWhiteSpace(c))
                        .ToList();

                    if (normalized.Count < 2)
                        throw new ArgumentException("Provide at least two choices.", nameof(dto.Choices));

                    existing.Choices = normalized;

                    // Ensure correct index is valid
                    if (existing.CorrectAnswerIndex < 0 || existing.CorrectAnswerIndex >= existing.Choices.Count)
                    {
                        existing.CorrectAnswerIndex = 0;
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
                break;

            case "multi-select":
                if (dto.Choices is not null)
                {
                    var normalized = dto.Choices
                        .Select(c => c?.Trim() ?? string.Empty)
                        .Where(c => !string.IsNullOrWhiteSpace(c))
                        .ToList();

                    if (normalized.Count < 2)
                        throw new ArgumentException("Provide at least two choices.", nameof(dto.Choices));

                    existing.Choices = normalized;
                }

                if (dto.CorrectAnswerIndexes is not null)
                {
                    existing.CorrectAnswerIndexes = dto.CorrectAnswerIndexes;
                }
                break;

            case "true-false":
                if (dto.CorrectBool is not null)
                {
                    existing.CorrectBool = dto.CorrectBool;
                }
                break;

            case "fill-blank":
            case "short":
            case "long":
                if (dto.CorrectAnswer is not null)
                {
                    existing.CorrectAnswer = dto.CorrectAnswer.Trim();
                }
                break;
        }

        return await _repo.UpdateAsync(existing);
    }

    public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);
}
