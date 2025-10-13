using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using QuizzyPop.Models;
using QuizzyPop.ViewModels;
using Microsoft.AspNetCore.Http;  // Add this for Session
using System.Text.Json;           // Add this for JsonSerializer

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
        [HttpGet]
        public IActionResult CreateQuiz()
        {
            var model = new QuizMetaDataViewModel();
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

            // TODO: Backend team will implement quiz saving logic here
            
            // For now, just redirect to a simple published page
            return RedirectToAction("PublishedQuiz", new { id = "temp123" });
        }

        // ==================== ABOUT PAGE ====================
        public IActionResult About()
        {
            return View();
        }

        // ==================== TAKE QUIZ PAGE ====================
        public IActionResult TakeQuiz()
        {
            // Example quiz data (will later come from a database)
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

            _logger.LogInformation($"TakeQuiz() called — loaded {quizzes.Count} quizzes");

            return View(quizzes);
        }

        // ==================== START QUIZ ====================
        public IActionResult StartQuiz(string id, int questionIndex = 0)
        {
            // Temporary in-memory quiz data (mocked until DB integration)
            var sampleQuiz = new QuizMetaDataViewModel
            {
                Title = id,
                Questions = new List<QuizQuestionViewModel>
                {
                    new QuizQuestionViewModel
                    {
                        Text = "What is the capital of France?",
                        Choices = new List<string>{ "Paris", "Rome", "London", "Madrid" },
                        CorrectAnswerIndex = 0
                    },
                    new QuizQuestionViewModel
                    {
                        Text = "Which animal is known as the King of the Jungle?",
                        Choices = new List<string>{ "Tiger", "Lion", "Elephant", "Bear" },
                        CorrectAnswerIndex = 1
                    },
                    new QuizQuestionViewModel
                    {
                        Text = "How many continents are there on Earth?",
                        Choices = new List<string>{ "5", "6", "7", "8" },
                        CorrectAnswerIndex = 2
                    }
                }
            };

            var totalQuestions = sampleQuiz.Questions.Count;
            if (questionIndex < 0) questionIndex = 0;
            if (questionIndex >= totalQuestions) questionIndex = totalQuestions - 1;

            var model = new TakingQuizViewModel
            {
                Title = sampleQuiz.Title,
                CurrentQuestionIndex = questionIndex,
                TotalQuestions = totalQuestions,
                CurrentQuestion = sampleQuiz.Questions[questionIndex]
            };

            return View("TakingQuiz", model);
        }

        // ==================== SUBMIT QUIZ ====================
        [HttpPost]
        public IActionResult SubmitQuiz(TakingQuizViewModel model, string action)
        {
            // Determine navigation logic based on button pressed
            int nextIndex = model.CurrentQuestionIndex;

            if (action == "next") nextIndex++;
            else if (action == "previous") nextIndex--;
            else if (action == "finish")
            {
                // TODO: Calculate score and display result page
                return RedirectToAction("QuizCompleted");
            }

            // Redirect to the same quiz with updated question index
            return RedirectToAction("StartQuiz", new { id = model.Title, questionIndex = nextIndex });
        }

        // ==================== QUIZ COMPLETED PAGE ====================
        public IActionResult QuizCompleted()
        {
            var result = new QuizResultViewModel
            {
                QuizTitle = "Animals of Savanna",
                TotalQuestions = 3,
                CorrectAnswers = 2,
                Difficulty = "Easy"
            };

            // Calculate the percentage score
            double percentage = (double)result.CorrectAnswers / result.TotalQuestions * 100;

            // Choose feedback based on score
            if (percentage >= 80)
            {
                result.FeedbackMessages = new List<string> { "🎉 Great job! You know your stuff!" };
            }
            else
            {
                result.FeedbackMessages = new List<string> { "💪 Keep practicing to score even higher next time!" };
            }

            return View(result);
        }


        // ==================== ERROR PAGE ====================
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpGet]
        public IActionResult PublishedQuiz(string id)
        {
            // TODO: Backend team will load actual quiz data from database using the id
            
            // For now, show a simple success page with placeholder data
            var model = new QuizMetaDataViewModel
            {
                Title = "Your Quiz",
                Description = "Quiz has been published successfully!",
                Category = "General",
                Difficulty = "Medium",
                Questions = new List<QuizQuestionViewModel>
                {
                    new QuizQuestionViewModel { Text = "Sample Question", Options = new List<string> { "A", "B", "C", "D" } }
                }
            };
            
            ViewBag.CreatorName = "Current User";
            ViewBag.QuizId = id ?? "QZ123456";
            
            return View(model);
        }

        [HttpGet]
        public IActionResult MyPage()
        {
            // Get user from session
            var userJson = HttpContext.Session.GetString("CurrentUser");
            if (userJson == null)
            {
                return RedirectToAction("Login", "Account");
            }
            
            var user = JsonSerializer.Deserialize<User>(userJson);
            return View(user);
        }

        [HttpGet]
        public IActionResult EditQuiz(string id)
        {
            // TODO: In production, fetch the actual quiz from database
            var model = new QuizMetaDataViewModel
            {
                Title = "Sample Quiz",
                Description = "This is a sample quiz",
                Category = "Science",
                Difficulty = "Medium",
                Questions = new List<QuizQuestionViewModel>
                {
                    new QuizQuestionViewModel
                    {
                        Text = "What is the capital of France?",
                        Options = new List<string> { "London", "Paris", "Berlin", "Madrid" },
                        CorrectAnswerIndex = 1
                    }
                }
            };

            return View(model);
        }
    }
}
