using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using QuizzyPop.Models;
using QuizzyPop.ViewModels;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

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
            ViewBag.Categories = _context.Categories.ToList();
            return View(new QuizMetaDataViewModel());
        }

        // ==================== CREATE QUIZ (POST) ====================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateQuiz(QuizMetaDataViewModel model)
        {
            if (string.IsNullOrEmpty(model.Title))
            {
                return View(model);
            }

            //Checks current user
            int currentUserId = HttpContext.Session.GetInt32("CurrentUserId") ?? 0;

            var newQuiz = new Quiz
            {
                Title = model.Title,
                Description = model.Description,
                Difficulty = model.Difficulty,
                CategoryId = model.CategoryId,
                UserId = null,
                CreatedAt = DateTime.Now
            };

            _context.Quiz.Add(newQuiz);
            await _context.SaveChangesAsync();

            return RedirectToAction("AddQuestions", new { quizId = newQuiz.Id });
        }

        [HttpGet]
        public IActionResult AddQuestions(int quizId)
        {
            var model = new QuizQuestionViewModel
            {
                QuizId = quizId,
                Choices = new List<string> { "", "", "", "" }
            };
            return View(new QuizQuestionViewModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddQuestions(QuizQuestionViewModel model, string action)
        {
            // Temporary validation - we just want the UI flow for now
            if (!string.IsNullOrEmpty(model.Text) && model.Choices.Any())
            {
                var question = new Question
                {
                    QuizId = model.QuizId,
                    Text = model.Text,
                    Choices = model.Choices,
                    CorrectAnswerIndex = model.CorrectAnswerIndex,
                };

                _context.Questions.Add(question);
                await _context.SaveChangesAsync();

                // If "Add Another Question" was clicked
                if (action == "addAnother")
                {
                    TempData["Success"] = "Question added successfully!";
                    return RedirectToAction("AddQuestions", new { quizId = model.QuizId });
                }

                // If "Finish Quiz" was clicked
                if (action == "finish")
                {
                    return RedirectToAction("Index");
                }
            }

            // If validation fails, return to the same view
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
        public async Task<IActionResult> StartQuiz(int id, int questionIndex = 0)
    {
        var quiz = await _context.Quiz
            .Include(q => q.Questions)
            .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
                return NotFound();

        var totalQuestions = quiz.Questions.Count;
            if (totalQuestions == 0)
            return View("EmptyQuiz", quiz);

        if (questionIndex < 0) questionIndex = 0;
        if (questionIndex >= totalQuestions) questionIndex = totalQuestions - 1;

        var question = quiz.Questions[questionIndex];

            var model = new TakingQuizViewModel
            {
                QuizId = quiz.Id,
                Title = quiz.Title,
                CurrentQuestionIndex = questionIndex,
                TotalQuestions = totalQuestions,
                CurrentQuestion = new QuizQuestionViewModel
                {
                    Text = question.Text,
                    Choices = question.Choices,
                    CorrectAnswerIndex = question.CorrectAnswerIndex
                }
            };
            model.SelectedAnswers = Enumerable.Repeat(-1, totalQuestions).ToList();

        return View("TakingQuiz", model);
}

        // ==================== SUBMIT QUIZ ====================
        [HttpPost]
        public async Task<IActionResult> SubmitQuiz(TakingQuizViewModel model, string action, int SelectedAnswer)
        {
            var quiz = await _context.Quiz
            .Include(q => q.Questions)
            .FirstOrDefaultAsync(q => q.Id == model.QuizId);

            if (quiz == null)
            {
                return NotFound();
            }

            // Retrieve stored answers from Tempdata, to calculate score later
            var storedJson = TempData["SelectedAnswers"] as string;
            List<int>? storedAnswers = !string.IsNullOrEmpty(storedJson) 
                ? System.Text.Json.JsonSerializer.Deserialize<List<int>>(storedJson)
                : null;

            if (storedAnswers == null || storedAnswers.Count != quiz.Questions.Count)
            {
                storedAnswers = Enumerable.Repeat(-1, quiz.Questions.Count).ToList();
            }

            storedAnswers[model.CurrentQuestionIndex] = SelectedAnswer;

            TempData["SelectedAnswers"] = System.Text.Json.JsonSerializer.Serialize(storedAnswers);

            // Changes navigation based on button pressed.
            int nextIndex = model.CurrentQuestionIndex;
            if (action == "next") nextIndex++;
            else if (action == "previous") nextIndex--;
            else if (action == "finish")
            {
                int CorrectAnswers = 0;
                for (int i = 0; i < quiz.Questions.Count; i++)
                {
                    if (storedAnswers[i] == quiz.Questions[i].CorrectAnswerIndex)
                    {
                        CorrectAnswers++; 
                    }
                }
                return RedirectToAction("QuizCompleted", new
                {
                    quizId = model.QuizId,
                    totalQuestions = quiz.Questions.Count,
                    correctAnswers = CorrectAnswers
                });
            }
            return RedirectToAction("StartQuiz", new { id = model.QuizId, questionIndex = nextIndex });
        }

        // ==================== QUIZ COMPLETED PAGE ====================
        public IActionResult QuizCompleted(int quizId, int totalQuestions, int correctAnswers)
        {
            var quiz = _context.Quiz.FirstOrDefault(q => q.Id == quizId);

            var result = new QuizResultViewModel
            {
                QuizId = quiz?.Id ?? 0,
                QuizTitle = quiz?.Title ?? "Completed Quiz",
                TotalQuestions = totalQuestions,
                CorrectAnswers = correctAnswers,
                Difficulty = quiz?.Difficulty ?? "Any"
            };

            // Calculate the percentage score
            double percentage = (double)result.CorrectAnswers / result.TotalQuestions * 100;

            // Choose feedback based on score
            if (percentage >= 80)
            {
                result.FeedbackMessages = new List<string> { "🎉 Great job! You know your stuff!" };

            }
            else if (percentage >= 50)
            {
                result.FeedbackMessages = new List<string> { "👍 Not bad! A little more effort and you'll do even better!" };
            }
            else
            {
                result.FeedbackMessages = new List<string> { "💪 Keep practicing to score even higher next time!" };
            }

            return View(result);
        }

        [HttpPost]
        public IActionResult RetryQuiz(int quizId)
        {
            // Clear any stored answers
            TempData.Remove("SelectedAnswers");

            return RedirectToAction("StartQuiz", new { id = quizId, questionIndex = 0 });
        }


        // ==================== ERROR PAGE ====================
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            var requestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;

            _logger.LogError("Error page displayed for RequestId: {RequestId}", requestId);
            return View(new ErrorViewModel { RequestId = requestId});
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
                {}
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
