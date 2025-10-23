namespace QuizzyPop.Services;

using Microsoft.Extensions.Logging;
using QuizzyPop.DAL.Repositories;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;

//Mellomleddet mellom API og databasen.
//Validerer data, sjekker at quiz eksisterer og Oppdatering of sletting med riktig logikk. 

public sealed class QuizQuestionService : IQuizQuestionService
{
    private readonly IQuizQuestionRepository _repo;
    private readonly IQuizRepository _quizRepo;
    private readonly ILogger<QuizQuestionService> _logger;

    public QuizQuestionService(
        IQuizQuestionRepository repo,
        IQuizRepository quizRepo,
        ILogger<QuizQuestionService> logger)
    {
        _repo = repo;
        _quizRepo = quizRepo;
        _logger = logger;
    }
    // Oppretter et nytt spørsmål for en bestemt quiz.
    // Utfører server-side validering og sjekker at quizen finnes før lagring.
    public async Task<QuizQuestion> CreateAsync(QuizQuestionCreateDto dto)
    {
        // Server-side inputvalidering
        if (dto.QuizId <= 0) throw new ArgumentException("QuizId is required", nameof(dto.QuizId));
        if (string.IsNullOrWhiteSpace(dto.Text)) throw new ArgumentException("Text is required", nameof(dto.Text));
        if (!string.IsNullOrWhiteSpace(dto.CorrectOption) &&
            dto.CorrectOption is not ("A" or "B" or "C" or "D"))
            throw new ArgumentException("CorrectOption must be A, B, C or D", nameof(dto.CorrectOption));

        // Sjekk at quiz finnes 
        var quiz = await _quizRepo.GetByIdAsync(dto.QuizId);
        if (quiz is null) throw new InvalidOperationException($"Quiz {dto.QuizId} not found");

        // Lager et nytt spørsmål basert på data fra DTO
        var entity = new QuizQuestion
        {
            QuizId = dto.QuizId,
            Text = dto.Text.Trim(),
            OptionA = dto.OptionA,
            OptionB = dto.OptionB,
            OptionC = dto.OptionC,
            OptionD = dto.OptionD,
            CorrectOption = dto.CorrectOption
        };

        return await _repo.AddAsync(entity);
    }
    //henting av spørsmål, if not null
    public Task<QuizQuestion?> GetAsync(int id) => _repo.GetByIdAsync(id);
    //henter alle spørsmål fra en quiz
    public Task<IReadOnlyList<QuizQuestion>> ListByQuizAsync(int quizId)
        => _repo.GetByQuizIdAsync(quizId);

    public async Task<bool> UpdateAsync(int id, QuizQuestionUpdateDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing is null) return false;

        if (!string.IsNullOrWhiteSpace(dto.Text)) existing.Text = dto.Text.Trim();
        if (dto.OptionA is not null) existing.OptionA = dto.OptionA;
        if (dto.OptionB is not null) existing.OptionB = dto.OptionB;
        if (dto.OptionC is not null) existing.OptionC = dto.OptionC;
        if (dto.OptionD is not null) existing.OptionD = dto.OptionD;
        if (dto.CorrectOption is not null)
        {
            if (dto.CorrectOption is not ("A" or "B" or "C" or "D"))
                throw new ArgumentException("CorrectOption must be A, B, C or D", nameof(dto.CorrectOption));
            existing.CorrectOption = dto.CorrectOption;
        }

        return await _repo.UpdateAsync(existing);
    }

    public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);
}
