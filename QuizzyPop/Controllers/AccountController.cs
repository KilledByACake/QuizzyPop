using Microsoft.AspNetCore.Mvc;
using QuizzyPop.Models; // This should include UserDbContext and User model
using QuizzyPop.ViewModels; // This should include LoginViewModel and RegisterViewModel
using System.Text.Json;
using QuizzyPop.DAL; // Add this line to include UserDbContext
using Microsoft.Extensions.Logging;

public class AccountController : Controller
{
    private readonly UserDbContext _context; // Ensure you have your DbContext injected
    private readonly ILogger<AccountController> _logger; // Add this line to include ILogger

    public AccountController(UserDbContext context, ILogger<AccountController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Login()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Login(LoginViewModel model)
    {
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Login attempted with invalid model state");
            return View(model);
        }

        var user = _context.Users.FirstOrDefault(u => u.Email == model.Email); // Synchronous version
        
        if (user == null || user.Password != model.Password)
        {
            _logger.LogWarning("Failed login attempt for email: {Email}", model.Email);
            ModelState.AddModelError("", "Invalid email or password");
            return View(model);
        }

        // Store user info in session
        HttpContext.Session.SetString("CurrentUser", JsonSerializer.Serialize(user));
        
        _logger.LogInformation("User {Email} logged in successfully", user.Email);
        
        return RedirectToAction("MyPage", "Home");
    }

    [HttpGet]
    public IActionResult Register()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Register(RegisterViewModel model)
    {
        if (!ModelState.IsValid)
            return View(model);

        // Check if the email is already registered
        if (_context.Users.Any(u => u.Email == model.Email))
        {
            ModelState.AddModelError("", "Email already registered.");
            return View(model);
        }

        // Create a new user without hashing
        var newUser = new User
        {
            Email = model.Email,
            Password = model.Password, // No hashing for now
            Role = "student",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return RedirectToAction("Login"); // Redirect to Login after successful registration
    }

    // Add Logout action
    [HttpPost]
    public IActionResult Logout()
    {
        HttpContext.Session.Remove("CurrentUser");
        return RedirectToAction("Index", "Home");
    }
}
