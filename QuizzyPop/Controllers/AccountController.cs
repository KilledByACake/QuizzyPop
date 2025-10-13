using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using QuizzyPop.Models;
using QuizzyPop.ViewModels;

namespace QuizzyPop.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                // Simple validation for demo accounts
                if (IsValidLogin(model.Email, model.Password))
                {
                    var tempUser = CreateTempUser(model.Email);
                    HttpContext.Session.SetString("CurrentUser", JsonSerializer.Serialize(tempUser));
                    return RedirectToAction("MyPage", "Home");
                }
                else
                {
                    ModelState.AddModelError("", "Invalid email or password");
                }
            }
            
            return View(model);
        }

        [HttpPost]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Index", "Home");
        }

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

        private User CreateTempUser(string email)
        {
            // Create different temp users based on email
            var tempUsers = new Dictionary<string, User>
            {
                ["demo@quizzypop.com"] = new User 
                { 
                    UserId = 1, 
                    Name = "Demo User",
                    Address = "123 Demo Street, Demo City",
                    DisplayName = "Demo User",
                    CreatedAt = DateTime.Now.AddDays(-30),
                    QuizzesCreated = 5,
                    QuizzesTaken = 12
                },
                ["test@quizzypop.com"] = new User 
                { 
                    UserId = 2, 
                    Name = "Test User",
                    Address = "456 Test Avenue, Test Town", 
                    DisplayName = "Test User",
                    CreatedAt = DateTime.Now.AddDays(-15),
                    QuizzesCreated = 3,
                    QuizzesTaken = 8
                },
                ["admin@quizzypop.com"] = new User 
                { 
                    UserId = 3, 
                    Name = "Admin User",
                    Address = "789 Admin Boulevard, Admin City",
                    DisplayName = "Admin User",
                    CreatedAt = DateTime.Now.AddDays(-90),
                    QuizzesCreated = 15,
                    QuizzesTaken = 25
                }
            };
            
            // Return specific user or create a generic one
            return tempUsers.ContainsKey(email.ToLower()) 
                ? tempUsers[email.ToLower()]
                : new User 
                { 
                    UserId = 999, 
                    Name = email.Split('@')[0], // Use email prefix as name
                    Address = "Generic Address, Generic City",
                    DisplayName = email.Split('@')[0],
                    CreatedAt = DateTime.Now,
                    QuizzesCreated = 1,
                    QuizzesTaken = 2
                };
        }
    }
}


