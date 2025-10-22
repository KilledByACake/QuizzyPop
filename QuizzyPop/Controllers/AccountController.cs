using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using QuizzyPop.Models;
using QuizzyPop.ViewModels;
using QuizzyPop.DAL;

namespace QuizzyPop.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserDbContext _context;
        public AccountController(UserDbContext context)
        {
            _context = context;
        }

        /* === LOGIN PAGE === */
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            return View(model);

        var user = _context.Users.FirstOrDefault(u => u.Email == model.Email);

        if (user == null || user.Password != model.Password)
        {
            ModelState.AddModelError("", "Invalid email or password");
            return View(model);
        }

        HttpContext.Session.SetString("CurrentUser", JsonSerializer.Serialize(user));

        return RedirectToAction("MyPage", "Home");
        }



        /* === REGISTER PAGE === */
        [HttpGet]
        public IActionResult Register()
        {
            // Show registration page
            return View();
        }

        [HttpPost]
        public IActionResult Register(IFormCollection form)
        {
            var email = form["email"].ToString();
            var password = form["password"].ToString();
            var confirmPassword = form["confirmPassword"].ToString();
            var role = form["role"].ToString().ToLower();
            var phone = form["phone"].ToString();
            var birthdate = DateTime.TryParse(form["birthdate"], out var b) ? b : DateTime.Now;

            if (string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(password) ||
                password != confirmPassword ||
                string.IsNullOrWhiteSpace(role))
            {
                ModelState.AddModelError("", "Please fill out all required fields correctly.");
                return View();
            }

            // Check if email exists
            if (_context.Users.Any(u => u.Email == email))
            {
                ModelState.AddModelError("", "Email already registered.");
                return View();
            }

            var newUser = new User
            {
                Email = email,
                Password = password,
                Role = role,
                Phone = phone,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            HttpContext.Session.SetString("CurrentUser", JsonSerializer.Serialize(newUser));
            return RedirectToAction("MyPage", "Home");
        }

        /* === LOGOUT === */
        [HttpPost]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Index", "Home");
        }

        /* === HELPER METHODS === */
        private bool IsValidLogin(string email, string password)
        {
            // Simple demo email/password validation
            var validCredentials = new Dictionary<string, string>
            {
                ["demo@quizzypop.com"] = "demo123",
                ["test@quizzypop.com"] = "test123",
                ["admin@quizzypop.com"] = "admin123"
            };

            // Check predefined accounts or allow any password for other emails
            return validCredentials.ContainsKey(email.ToLower())
                ? validCredentials[email.ToLower()] == password
                : password == "password"; // Default password for any other email
        }
    }
}
