using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using QuizzyPop.Services;
using QuizzyPop.Models.Dtos;

namespace QuizzyPop.Controllers.Api;

[Authorize]
[ApiController]
[Route("api/quizzes/{quizId:int}/submit")]
public class QuizSubmissionController : ControllerBase
{
    private readonly IQuizService _service;
    public QuizSubmissionController(IQuizService service) => _service = service;

    [HttpPost]
    public async Task<ActionResult<QuizSubmissionResultDto>> Submit(
        int quizId,
        [FromBody] QuizSubmissionDto dto)
    {
        var result = await _service.SubmitAsync(quizId, dto);
        return Ok(result);
    }
}
