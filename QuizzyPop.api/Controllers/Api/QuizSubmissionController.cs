using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using QuizzyPop.Services;
using QuizzyPop.Models.Dtos;

namespace QuizzyPop.Controllers.Api;

[Authorize]
[ApiController]
[Route("api/quizzes")]  
public class QuizSubmissionController : ControllerBase
{
    private readonly IQuizService _service;
    public QuizSubmissionController(IQuizService service) => _service = service;

    [HttpPost("{quizId:int}/submit")]
    [AllowAnonymous]  //  - allows anonymous quiz submission
    public async Task<ActionResult<QuizSubmissionResultDto>> Submit(
        int quizId,
        [FromBody] QuizSubmissionDto dto)
    {
        var result = await _service.SubmitAsync(quizId, dto);
        return Ok(result);
    }
}
