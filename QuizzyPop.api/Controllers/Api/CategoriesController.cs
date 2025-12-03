using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizzyPop.DAL;
using QuizzyPop.Models;

namespace QuizzyPop.Api.Controllers;

// API controller for exposing quiz categories (currently read-only list)
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly UserDbContext _db;

    public CategoriesController(UserDbContext db)
    {
        _db = db;
    }

    // GET: api/categories - returns all categories
    [HttpGet]
    [AllowAnonymous] // Allow unauthenticated clients to retrieve categories (public metadata)
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var categories = await _db.Categories.ToListAsync();
        return Ok(categories);
    }
}