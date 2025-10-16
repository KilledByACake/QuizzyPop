using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using QuizzyPop.Models;
using QuizzyPop.ViewModels;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace QuizzyPop.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserDbContext _context;

        public HomeController(UserDbContext context, ILogger<HomeController> logger)
        {
            _logger = logger;
            _context = context;
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
        public IActionResult CreateQuiz(QuizMetaDataViewModel model)  // Changed from Create to CreateQuiz
        {
            // Simple validation to proceed to questions page
            if (!string.IsNullOrEmpty(model.Title))
            {
                return RedirectToAction("AddQuestions");
            }
            return View(model);  // Changed from View("CreateQuiz", model)
        }

        public IActionResult AddQuestions(string quizId)
        {
            var model = new QuizQuestionViewModel
            {
                Text = string.Empty,
                Image = string.Empty,
                Choices = new List<string> { "", "", "", "" },  // Initialize 4 empty choices
                Options = new List<string> { "", "", "", "" },  // Keep both for compatibility
                CorrectAnswerIndex = 0,
                Points = 1,
                TimeLimit = 0,
                ShuffleAnswers = false,
                Required = true,
                Explanation = string.Empty
            };

            return View(model);
        }

        // ==================== ABOUT PAGE ====================
        public IActionResult About()
        {
            return View();
        }
        // ==================== TAKE QUIZ PAGE ====================
        public async Task<IActionResult> TakeQuiz()
        {
            var quizzes = await _context.Quiz
                .Include(q => q.Category)
                .Include(q => q.User)
                .Include(q => q.Questions)
                .ToListAsync();

            _logger.LogInformation($"Loaded {quizzes.Count} quizzes from database.");
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
        public IActionResult EditQuiz(int id)
        {
            // TODO: Backend Implementation Required
            // 1. Use the 'id' parameter to fetch the quiz and its questions from the database
            // 2. Include all quiz data:
            //    - Quiz metadata (title, description, etc.)
            //    - All questions with their complete data
            //    - Correct answer indices
            //    - Points and time limits
            //    - Any quiz-specific settings
            // 3. Map the database entities to QuizQuestionViewModel
            // 4. Ensure all form fields are populated with existing data
            // 5. Consider adding audit info (last edited, created by, etc.)
            
            // Example of expected data structure:
            var questions = new List<QuizQuestionViewModel>
            {
                new QuizQuestionViewModel
                {
                    Text = "Sample Question 1",
                    Choices = new List<string> { "Option 1", "Option 2", "Option 3", "Option 4" },
                    CorrectAnswerIndex = 0,
                    Points = 10,
                    TimeLimit = 30,
                    Required = true,
                    ShuffleAnswers = false,
                    Explanation = "Sample explanation"
                }
            };

            return View(questions);
        }

        [HttpPost]
        public IActionResult EditQuiz(List<QuizQuestionViewModel> questions)
        {
            if (ModelState.IsValid)
            {
                // TODO: Save changes to database
                return RedirectToAction("Index");
            }
            return View(questions);
        }

        [HttpPost]
        public IActionResult AddQuestion(QuizQuestionViewModel model, string action)
        {
            // Temporary validation - we just want the UI flow for now
            if (!string.IsNullOrEmpty(model.Text) && model.Choices.Any())
            {
                // If "Add Another Question" was clicked
                if (action == "addAnother")
                {
                    TempData["Success"] = "Question added successfully!";
                    return RedirectToAction("AddQuestions");
                }
                
                // If "Finish Quiz" was clicked
                if (action == "finish")
                {
                    return RedirectToAction("Index");
                }
            }

            // If validation fails, return to the same view
            return View("AddQuestions", model);
        }
    }
}
