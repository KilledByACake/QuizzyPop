using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using QuizzyPop.Models;
using QuizzyPop.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System; // Add this line for DateTime

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
            // Initialize a new quiz model with one empty question
            _logger.LogInformation("This is an information message.");
        _logger.LogWarning("This is a warning message");
        _logger.LogError("This is an error message.");
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

            _logger.LogInformation("Model is valid, setting TempData");

            // Store data in TempData to pass to the redirect
            TempData["QuizTitle"] = model.Title;
            TempData["QuizDescription"] = model.Description;
            TempData["QuizCategory"] = model.Category;
            TempData["QuizDifficulty"] = model.Difficulty;
            TempData["QuizTimeLimit"] = model.TimeLimit;
            TempData["QuizTags"] = model.Tags;
            TempData["QuestionCount"] = model.Questions?.Count ?? 0;
            TempData["CreatorName"] = "Current User";
            TempData["QuizId"] = "QZ" + DateTime.Now.Ticks.ToString().Substring(0, 6);
            
            _logger.LogInformation("Redirecting to PublishedQuiz");
            
            // Redirect instead of returning a view directly
            return RedirectToAction("PublishedQuiz");
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
        public IActionResult PublishedQuiz(string id = null)
        {
            _logger.LogInformation("PublishedQuiz GET action called");
            _logger.LogInformation($"TempData QuizTitle: {TempData["QuizTitle"]}");
            
            QuizMetaDataViewModel model;
            
            // Check if we're coming from a redirect (after creating a quiz)
            if (TempData["QuizTitle"] != null)
            {
                _logger.LogInformation("Using TempData to build model");
                
                // Use the data from TempData (from the Create action)
                model = new QuizMetaDataViewModel
                {
                    Title = TempData["QuizTitle"] as string,
                    Description = TempData["QuizDescription"] as string,
                    Category = TempData["QuizCategory"] as string,
                    Difficulty = TempData["QuizDifficulty"] as string,
                    TimeLimit = (int)(TempData["QuizTimeLimit"] ?? 0),
                    Tags = TempData["QuizTags"] as string,
                    Questions = new List<QuizQuestionViewModel>()
                };
                
                // Add dummy questions based on count from TempData
                int questionCount = (int)(TempData["QuestionCount"] ?? 1);
                for (int i = 0; i < questionCount; i++)
                {
                    model.Questions.Add(new QuizQuestionViewModel 
                    { 
                        Text = $"Question {i + 1}",
                        Options = new List<string> { "Option A", "Option B", "Option C", "Option D" }
                    });
                }
                
                ViewBag.CreatorName = TempData["CreatorName"] as string;
                ViewBag.QuizId = TempData["QuizId"] as string;
            }
            else
            {
                _logger.LogInformation("Using fallback sample data");
                
                // Direct access with ID (fallback for when someone visits the URL directly)
                model = new QuizMetaDataViewModel
                {
                    Title = "Sample Quiz",
                    Description = "This is a sample quiz",
                    Category = "General Knowledge",
                    Difficulty = "Medium",
                    Questions = new List<QuizQuestionViewModel>
                    {
                        new QuizQuestionViewModel 
                        { 
                            Text = "Sample Question",
                            Options = new List<string> { "A", "B", "C", "D" }
                        }
                    }
                };
                
                ViewBag.CreatorName = "Sample User";
                ViewBag.QuizId = id ?? "QZ123456";
            }
            
            _logger.LogInformation($"Returning view with model title: {model.Title}");
            return View(model);
        }
    }
}
