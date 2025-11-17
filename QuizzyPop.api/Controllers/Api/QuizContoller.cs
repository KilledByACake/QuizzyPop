namespace QuizzyPop.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;
using QuizzyPop.Services;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[ApiController]
[Route("api/quizzes")]
public class QuizController : ControllerBase
{
    private readonly IQuizService _service;
    public QuizController(IQuizService service) => _service = service;

    // GET api/quizzes/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Quiz>> Get(int id)
        => (await _service.GetAsync(id)) is { } q ? Ok(q) : NotFound();

    // GET api/quizzes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Quiz>>> List()
        => Ok(await _service.ListAsync());

    // (valgfritt) GET api/quizzes/5/with-questions
    [HttpGet("{id:int}/with-questions")]
    public async Task<ActionResult<Quiz>> GetWithQuestions(int id)
        => (await _service.GetWithQuestionsAsync(id)) is { } q ? Ok(q) : NotFound();

    // POST api/quizzes
    [HttpPost]
    public async Task<ActionResult<Quiz>> Create([FromBody] QuizCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    // OBS: Ingen Update/Delete her, siden IQuizService ikke eksponerer disse metodene nå.
}
