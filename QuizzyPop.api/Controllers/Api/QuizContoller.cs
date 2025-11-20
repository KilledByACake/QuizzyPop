using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;
using QuizzyPop.Services;

namespace QuizzyPop.Controllers.Api;

[Authorize]
[ApiController]
[Route("api/quizzes")]
public class QuizController : ControllerBase
{
    private readonly IQuizService _service;
    private readonly IWebHostEnvironment _env;

    public QuizController(IQuizService service, IWebHostEnvironment env)
    {
        _service = service;
        _env = env;
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<Quiz>> Get(int id)
        => (await _service.GetAsync(id)) is { } q ? Ok(q) : NotFound();


    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Quiz>>> List()
        => Ok(await _service.ListAsync());


    [HttpGet("{id:int}/with-questions")]
    [AllowAnonymous]
    public async Task<ActionResult<Quiz>> GetWithQuestions(int id)
        => (await _service.GetWithQuestionsAsync(id)) is { } q ? Ok(q) : NotFound();


    [HttpPost]
    public async Task<ActionResult<Quiz>> Create([FromBody] QuizCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);


        if (string.IsNullOrEmpty(created.ImageUrl))
            created.ImageUrl = "/images/default_quiz.png";

        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

 
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] QuizUpdateDto dto)
    {
        var ok = await _service.UpdateAsync(id, dto);
        if (!ok) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.DeleteAsync(id);
        if (!ok) return NotFound();
        return NoContent();
    }

    [HttpPost("{id:int}/image")]
    public async Task<IActionResult> UploadQuizImage(int id, [FromForm] QuizImageUploadDto dto)
    {
        var quiz = await _service.GetAsync(id);
        if (quiz == null) return NotFound("Quiz not found.");


        var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
        if (!allowedTypes.Contains(dto.Image.ContentType))
            return BadRequest("Only jpg, png, or webp images are allowed.");
        if (dto.Image.Length > 5_000_000)
            return BadRequest("Image must be smaller than 5 MB.");

        var folder = Path.Combine(_env.WebRootPath, "images", "quizzes");
        if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

        var extension = Path.GetExtension(dto.Image.FileName).ToLower();
        var fileName = $"quiz_{quiz.Id}{extension}";
        var path = Path.Combine(folder, fileName);
        using var stream = new FileStream(path, FileMode.Create);
        await dto.Image.CopyToAsync(stream);

        quiz.ImageUrl = $"/images/quizzes/{fileName}";
        await _service.UpdateAsync(quiz.Id, new QuizUpdateDto { ImageUrl = quiz.ImageUrl });

        return Ok(new { imageUrl = quiz.ImageUrl });
    }

    [HttpDelete("{id:int}/image")]
    public async Task<IActionResult> DeleteQuizImage(int id)
    {
        var quiz = await _service.GetAsync(id);
        if (quiz == null) return NotFound("Quiz not found.");

        if (!string.IsNullOrEmpty(quiz.ImageUrl))
        {
            var filePath = Path.Combine(_env.WebRootPath, quiz.ImageUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
            if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath);
        }

        await _service.UpdateAsync(quiz.Id, new QuizUpdateDto { ImageUrl = null });

        return NoContent();
    }
}
