using Microsoft.AspNetCore.Mvc;
using QuizzyPop.Models;

namespace QuizzyPop.Controllers;

public class UserController : Controller
{
    private readonly UserDbContext _userDbContext;

    public UserController(UserDbContext userDbContext)
    {
        _userDbContext = userDbContext;
    }

    public IActionResult Details(int id)
    {
        var user = _userDbContext.Users.FirstOrDefault(u => u.UserId == id);
        if (user == null)
            return NotFound();
        return View(user);
    }
}
