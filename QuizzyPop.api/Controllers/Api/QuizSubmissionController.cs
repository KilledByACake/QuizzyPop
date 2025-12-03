using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using QuizzyPop.Services;
using QuizzyPop.Models.Dtos;

namespace QuizzyPop.Controllers.Api;

// API controller for handling quiz submissions and scoring
[Authorize]
[ApiController]
[Route("api/quizzes")]  
public class QuizSubmissionController : ControllerBase
{
    private readonly IQuizService _service;
    public QuizSubmissionController(IQuizService service) => _service = service;

    // POST: api/quizzes/{quizId}/submit - submit answers for a quiz and get the result
    [HttpPost("{quizId:int}/submit")]
    [AllowAnonymous]  // Allow unauthenticated users to submit quiz answers
    public async Task<ActionResult<QuizSubmissionResultDto>> Submit(
        int quizId,
        [FromBody] QuizSubmissionDto dto)
    {
        var result = await _service.SubmitAsync(quizId, dto);
        return Ok(result);
    }
}
