namespace QuizzyPop.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;
using QuizzyPop.Services;

[ApiController]
[Route("api/quizzes")]
public class QuizController : ControllerBase
{
    private readonly IQuizService _service;
    public QuizController(IQuizService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Quiz>> Get(int id)
        => (await _service.GetAsync(id)) is { } q ? Ok(q) : NotFound();

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Quiz>>> List([FromQuery] bool? published)
        => Ok(await _service.ListAsync(published));

    [HttpPost]
    public async Task<ActionResult<Quiz>> Create([FromBody] QuizCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] QuizUpdateDto dto)
        => await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
        => await _service.DeleteAsync(id) ? NoContent() : NotFound();
}
