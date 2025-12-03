namespace QuizzyPop.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;
using QuizzyPop.Services;
using Microsoft.AspNetCore.Authorization;

// API controller for managing quiz questions via REST endpoints
[Authorize]
[ApiController]
[Route("api/quiz-questions")]
public class QuizQuestionController : ControllerBase
{
    private readonly IQuizQuestionService _service;

    public QuizQuestionController(IQuizQuestionService service)
        => _service = service;

    // GET: /api/quiz-questions/{id} - returns a single question by its id
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Question>> Get(int id)
        => (await _service.GetAsync(id)) is { } q ? Ok(q) : NotFound();

    // GET: /api/quiz-questions/by-quiz/{quizId} - returns all questions for a given quiz
    [HttpGet("by-quiz/{quizId:int}")]
    public async Task<ActionResult<IEnumerable<Question>>> ListByQuiz(int quizId)
        => Ok(await _service.ListByQuizAsync(quizId));

    // POST: /api/quiz-questions - creates a new question
    [HttpPost]
    public async Task<ActionResult<Question>> Create([FromBody] QuizQuestionCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    // PUT: /api/quiz-questions/{id} - updates an existing question
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] QuizQuestionUpdateDto dto)
        => await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

    // DELETE: /api/quiz-questions/{id} - deletes a question by id
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
        => await _service.DeleteAsync(id) ? NoContent() : NotFound();
}