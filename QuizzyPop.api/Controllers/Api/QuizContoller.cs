using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;
using QuizzyPop.Services;
using QuizzyPop.DAL.Repositories;

namespace QuizzyPop.Controllers.Api;

// API controller for managing quizzes and their associated images
[Authorize]
[ApiController]
[Route("api/quizzes")]
public class QuizController : ControllerBase
{
    private readonly IQuizService _service;
    private readonly IWebHostEnvironment _env;
    private readonly IQuizRepository _repo;

    public QuizController(IQuizService service, IWebHostEnvironment env, IQuizRepository repo)
    {
        _service = service;
        _env = env;
        _repo = repo;
    }

    // GET: api/quizzes/{id} - returns a single quiz or 404 if not found
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<Quiz>> Get(int id)
        => (await _service.GetAsync(id)) is { } q ? Ok(q) : NotFound();


    // GET: api/quizzes - returns all quizzes
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Quiz>>> List(){
        var quizzes = await _repo.GetAllWithDetailsAsync();
        return Ok(quizzes);}


    // GET: api/quizzes/{id}/with-questions - returns quiz including its questions
    [HttpGet("{id:int}/with-questions")]
    [AllowAnonymous]
    public async Task<ActionResult<Quiz>> GetWithQuestions(int id)
        => (await _service.GetWithQuestionsAsync(id)) is { } q ? Ok(q) : NotFound();


    // POST: api/quizzes - creates a new quiz
    [HttpPost]
    public async Task<ActionResult<Quiz>> Create([FromBody] QuizCreateDto dto)
    {
        var created = await _service.CreateAsync(dto);

        // Ensure a default image is set when none is provided
        if (string.IsNullOrEmpty(created.ImageUrl))
            created.ImageUrl = "/images/default_quiz.png";

        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    // PUT: api/quizzes/{id} - updates an existing quiz
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] QuizUpdateDto dto)
    {
        var ok = await _service.UpdateAsync(id, dto);
        if (!ok) return NotFound();
        return NoContent();
    }
    
    // DELETE: api/quizzes/{id} - deletes a quiz
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.DeleteAsync(id);
        if (!ok) return NotFound();
        return NoContent();
    }

    // POST: api/quizzes/{id}/image - uploads or replaces a quiz image on disk and updates ImageUrl
    [HttpPost("{id:int}/image")]
    public async Task<IActionResult> UploadQuizImage(int id, [FromForm] QuizImageUploadDto dto)
    {
        var quiz = await _service.GetAsync(id);
        if (quiz == null) return NotFound("Quiz not found.");

        // Basic content-type and size validation for uploaded images
        var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
        if (!allowedTypes.Contains(dto.Image.ContentType))
            return BadRequest("Only jpg, png, or webp images are allowed.");
        if (dto.Image.Length > 5_000_000)
            return BadRequest("Image must be smaller than 5 MB.");

        var folder = Path.Combine(_env.WebRootPath, "images", "quizzes");
        if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

        // Use quiz id as part of the filename so each quiz has a predictable image path
        var extension = Path.GetExtension(dto.Image.FileName).ToLower();
        var fileName = $"quiz_{quiz.Id}{extension}";
        var path = Path.Combine(folder, fileName);
        using var stream = new FileStream(path, FileMode.Create);
        await dto.Image.CopyToAsync(stream);

        quiz.ImageUrl = $"/images/quizzes/{fileName}";
        await _service.UpdateAsync(quiz.Id, new QuizUpdateDto { ImageUrl = quiz.ImageUrl });

        return Ok(new { imageUrl = quiz.ImageUrl });
    }

    // DELETE: api/quizzes/{id}/image - deletes the quiz image from disk and clears ImageUrl
    [HttpDelete("{id:int}/image")]
    public async Task<IActionResult> DeleteQuizImage(int id)
    {
        // Map the relative URL to a physical path under wwwroot
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
