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

        // -------------------- HOME PAGE --------------------
        public IActionResult Index()
        {
            return View();
        }

        // -------------------- CREATE QUIZ --------------------
        public IActionResult CreateQuiz()
        {
            var model = new QuizMetaDataViewModel
            {
                Questions = new List<QuizQuestionViewModel>
                {
                    new QuizQuestionViewModel() // Start med ett tomt spørsmål
                }
            };
            return View(model);
        }

        // -------------------- POST: CREATE QUIZ --------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(QuizMetaDataViewModel model)
        {
            if (!ModelState.IsValid)
            {
                // Valideringsfeil – vis siden igjen
                return View("CreateQuiz", model);
            }

            // TODO: Lagre quiz til database her senere

            // Etter lagring, send brukeren til publisert-siden
            return View("QuizPublished", model);
        }

        // -------------------- TAKE QUIZ --------------------
        public IActionResult TakeQuiz()
        {
            // Eksempeldata – dette vil senere hentes fra databasen
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
                    Description = "Shapes and formulas quiz",
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

            // Logg til terminal for å bekrefte at metoden kjører
            Console.WriteLine($"TakeQuiz() called — loaded {quizzes.Count} quizzes");

            return View(quizzes);
        }

        // -------------------- START QUIZ --------------------
        public IActionResult StartQuiz(string id)
        {
            // Her kan du senere hente riktig quiz fra database basert på ID
            ViewData["QuizId"] = id;
            return Content($"Starting quiz: {id}");
        }

    }
}
