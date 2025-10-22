namespace QuizzyPop.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;
using QuizzyPop.Services;

[ApiController]
[Route("api/quiz-questions")]
public class QuizQuestionController : ControllerBase
{
    private readonly IQuizQuestionService _service;

    public QuizQuestionController(IQuizQuestionService service)
        => _service = service;

    // GET /api/quiz-questions/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<QuizQuestion>> Get(int id)
        => (await _service.GetAsync(id)) is { } q ? Ok(q) : NotFound();

    // GET /api/quiz-questions/by-quiz/{quizId}
    [HttpGet("by-quiz/{quizId:int}")]
    public async Task<ActionResult<IEnumerable<QuizQuestion>>> ListByQuiz(int quizId)
        => Ok(await _service.ListByQuizAsync(quizId));

    // POST /api/quiz-questions
    [HttpPost]
    public async Task<ActionResult<QuizQuestion>> Create([FromBody] QuizQuestionCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    // PUT /api/quiz-questions/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] QuizQuestionUpdateDto dto)
        => await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

    // DELETE /api/quiz-questions/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
        => await _service.DeleteAsync(id) ? NoContent() : NotFound();
}
