namespace QuizzyPop.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;
using QuizzyPop.Services;
using Microsoft.AspNetCore.Authorization;

//rest ApI

[Authorize]
[ApiController]
[Route("api/quiz-questions")]
public class QuizQuestionController : ControllerBase
{
    private readonly IQuizQuestionService _service;

    public QuizQuestionController(IQuizQuestionService service)
        => _service = service;

    // GET /api/quiz-questions/{id} , den henter basert på ID
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Question>> Get(int id)
        => (await _service.GetAsync(id)) is { } q ? Ok(q) : NotFound();

    // GET /api/quiz-questions/by-quiz/{quizId}
    // Henter alle spørsmål etter quizID
    [HttpGet("by-quiz/{quizId:int}")]
    public async Task<ActionResult<IEnumerable<Question>>> ListByQuiz(int quizId)
        => Ok(await _service.ListByQuizAsync(quizId));

    // POST /api/quiz-questions
    //Lage nytt spørmsål
    [HttpPost]
    public async Task<ActionResult<Question>> Create([FromBody] QuizQuestionCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    // PUT /api/quiz-questions/{id}
    // Oppdaterer et eksisterende spørsmål
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] QuizQuestionUpdateDto dto)
        => await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

    // DELETE /api/quiz-questions/{id}
    // Sletter et spørsmål utifra ID
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
        => await _service.DeleteAsync(id) ? NoContent() : NotFound();
}