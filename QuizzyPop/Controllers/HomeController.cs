using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using QuizzyPop.Models;
using QuizzyPop.ViewModels;
using System.Collections.Generic;

namespace QuizzyPop.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        // ==================== HOME PAGE ====================
        public IActionResult Index()
        {
            return View();
        }

        // ==================== CREATE QUIZ (GET) ====================
        public IActionResult CreateQuiz()
        {
            // Create a new quiz model with one empty question
            var model = new QuizMetaDataViewModel
            {
                Questions = new List<QuizQuestionViewModel>
                {
                    new QuizQuestionViewModel()
                }
            };

            return View(model);
        }

        // ==================== CREATE QUIZ (POST) ====================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(QuizMetaDataViewModel model)
        {
            if (!ModelState.IsValid)
            {
                // Validation failed — reload the same page with errors
                return View("CreateQuiz", model);
            }

            // TODO: Save quiz to database here later

            // After saving, show the “quiz published” page
            return View("QuizPublished", model);
        }

        // ==================== TAKE QUIZ PAGE ====================
        public IActionResult TakeQuiz()
        {
            // Example quiz data (to be fetched from a database later)
            var quizzes = new List<QuizMetaDataViewModel>
            {
                new QuizMetaDataViewModel
                {
                    Title = "Animals of Savanna",
                    Description = "Learn about African wildlife!",
                    Difficulty = "Easy",
                    Questions = new List<QuizQuestionViewModel>()
                },
                new QuizMetaDataViewModel
                {
                    Title = "Disney Characters",
                    Description = "Guess your favorite Disney heroes!",
                    Difficulty = "Easy",
                    Questions = new List<QuizQuestionViewModel>()
                },
                new QuizMetaDataViewModel
                {
                    Title = "Geometry",
                    Description = "Shapes and formulas quiz.",
                    Difficulty = "Medium",
                    Questions = new List<QuizQuestionViewModel>()
                },
                new QuizMetaDataViewModel
                {
                    Title = "Roman Empire",
                    Description = "How well do you know ancient history?",
                    Difficulty = "Medium",
                    Questions = new List<QuizQuestionViewModel>()
                },
                new QuizMetaDataViewModel
                {
                    Title = "Football Stars",
                    Description = "Can you guess players from clues?",
                    Difficulty = "Hard",
                    Questions = new List<QuizQuestionViewModel>()
                }
            };

            // Log confirmation to console for debugging
            Console.WriteLine($"TakeQuiz() called — loaded {quizzes.Count} quizzes");

            return View(quizzes);
        }

        // ==================== START QUIZ ====================
        public IActionResult StartQuiz(string id)
        {
            // This method will later fetch a specific quiz by its ID
            ViewData["QuizId"] = id;
            return Content($"Starting quiz: {id}");
        }
    }
}
