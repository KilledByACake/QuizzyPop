using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using QuizzyPop.Models;
using QuizzyPop.DAL;
using QuizzyPop.DAL.Repositories;
using QuizzyPop.ViewModels;
using System.Text.Json;

namespace QuizzyPop.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IQuizRepository _quizRepo;
        private readonly IQuestionRepository _questionRepo;

        public HomeController(
            ILogger<HomeController> logger,
            IQuizRepository quizRepo,
            IQuestionRepository questionRepo)
        {
            _logger = logger;
            _quizRepo = quizRepo;
            _questionRepo = questionRepo;
        }

        // ==================== HOME PAGE ====================
        public IActionResult Index()
        {
            return View();
        }

        // ==================== CREATE QUIZ (GET) ====================
        [HttpGet]
        public async Task<IActionResult> CreateQuiz()
        {
            var categories = await _quizRepo.GetAllCategoriesAsync();
            ViewBag.Categories = categories;
            return View(new QuizMetaDataViewModel());
        }

        // ==================== CREATE QUIZ (POST) ====================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateQuiz(QuizMetaDataViewModel model)
        {
            if (string.IsNullOrEmpty(model.Title))
            {
                _logger.LogWarning("Create Quiz attempted without title");
                return View(model);
            }

            try
            {
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

                await _quizRepo.AddAsync(newQuiz);
                _logger.LogInformation("Quiz '{Title}' created successfully with ID {Id}", newQuiz.Title, newQuiz.Id);

                return RedirectToAction("AddQuestions", new { quizId = newQuiz.Id });
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error while attempting to create new quiz with Title: {Title}", model.Title);
                ModelState.AddModelError(string.Empty, "Kunne ikke lagre quizen. Kontroller dataene dine og prøv igjen.");
                ViewBag.Categories = await _quizRepo.GetAllCategoriesAsync();
                return View(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in CreateQuiz POST action for Title: {Title}", model.Title);
                ModelState.AddModelError(string.Empty, "En uventet feil oppstod. Prøv igjen.");
                ViewBag.Categories = await _quizRepo.GetAllCategoriesAsync();
                return View(model);
            }
        }

        // ==================== ADD QUESTIONS ====================
        [HttpGet]
        public IActionResult AddQuestions(int quizId)
        {
            var model = new QuizQuestionViewModel
            {
                QuizId = quizId,
                Choices = new List<string> { "", "", "", "" }
            };
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddQuestions(QuizQuestionViewModel model, string action)
        {
            if (!ModelState.IsValid)
                return View("AddQuestions", model);

            var quiz = await _quizRepo.GetByIdAsync(model.QuizId);
            if (quiz == null)
                return NotFound();

            var question = new Question
            {
                QuizId = model.QuizId,
                Text = model.Text,
                Choices = model.Choices,
                CorrectAnswerIndex = model.CorrectAnswerIndex
            };

            await _questionRepo.AddAsync(question);
            _logger.LogInformation("Added question to quiz {QuizId}", model.QuizId);

            if (action == "finish")
                return RedirectToAction("Index");

            ModelState.Clear();
            model.Text = "";
            model.Choices = new List<string> { "", "", "", "" };
            return View("AddQuestions", model);
        }

        // ==================== TAKE QUIZ ====================
        public async Task<IActionResult> TakeQuiz()
        {
            try
            {
                var quizzes = await _quizRepo.GetAllWithDetailsAsync();
                _logger.LogInformation("Loaded {Count} quizzes from repository.", quizzes.Count());
                return View(quizzes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load quizzes from repository in TakeQuiz action.");
                ViewBag.ErrorMessage = "Kunne ikke laste inn quizzer akkurat nå. Prøv igjen senere.";
                return View(new List<Quiz>());
            }
        }

        // ==================== START QUIZ ====================
        public async Task<IActionResult> StartQuiz(int id, int questionIndex = 0)
        {
            try
            {
                var quiz = await _quizRepo.GetQuizWithQuestionsAsync(id);
                if (quiz == null)
                    return NotFound();

                var totalQuestions = quiz.Questions.Count;
                if (totalQuestions == 0)
                    return View("EmptyQuiz", quiz);

                questionIndex = Math.Clamp(questionIndex, 0, totalQuestions - 1);
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
                    },
                    SelectedAnswers = Enumerable.Repeat(-1, totalQuestions).ToList()
                };

                return View("TakingQuiz", model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error starting Quiz ID: {QuizId}", id);
                return RedirectToAction("Error");
            }
        }

        // ==================== SUBMIT QUIZ ====================
        [HttpPost]
        public async Task<IActionResult> SubmitQuiz(TakingQuizViewModel model, string action, int SelectedAnswer)
        {
            var quiz = await _quizRepo.GetQuizWithQuestionsAsync(model.QuizId);
            if (quiz == null)
                return NotFound();

            var storedJson = TempData["SelectedAnswers"] as string;
            List<int>? storedAnswers = !string.IsNullOrEmpty(storedJson)
                ? JsonSerializer.Deserialize<List<int>>(storedJson)
                : Enumerable.Repeat(-1, quiz.Questions.Count).ToList();

            storedAnswers[model.CurrentQuestionIndex] = SelectedAnswer;
            TempData["SelectedAnswers"] = JsonSerializer.Serialize(storedAnswers);

            int nextIndex = model.CurrentQuestionIndex;
            if (action == "next") nextIndex++;
            else if (action == "previous") nextIndex--;
            else if (action == "finish")
            {
                int correctAnswers = 0;
                for (int i = 0; i < quiz.Questions.Count; i++)
                {
                    if (storedAnswers[i] == quiz.Questions[i].CorrectAnswerIndex)
                        correctAnswers++;
                }

                return RedirectToAction("QuizCompleted", new
                {
                    quizId = model.QuizId,
                    totalQuestions = quiz.Questions.Count,
                    correctAnswers
                });
            }

            return RedirectToAction("StartQuiz", new { id = model.QuizId, questionIndex = nextIndex });
        }

        // ==================== QUIZ COMPLETED PAGE ====================
        public async Task<IActionResult> QuizCompleted(int quizId, int totalQuestions, int correctAnswers)
        {
            var quiz = await _quizRepo.GetByIdAsync(quizId);
            var result = new QuizResultViewModel
            {
                QuizId = quiz?.Id ?? 0,
                QuizTitle = quiz?.Title ?? "Completed Quiz",
                TotalQuestions = totalQuestions,
                CorrectAnswers = correctAnswers,
                Difficulty = quiz?.Difficulty ?? "Any"
            };

            double percentage = (double)result.CorrectAnswers / result.TotalQuestions * 100;

            if (percentage >= 80)
                result.FeedbackMessages = new List<string> { "🎉 Great job! You know your stuff!" };
            else if (percentage >= 50)
                result.FeedbackMessages = new List<string> { "👍 Not bad! A little more effort and you'll do even better!" };
            else
                result.FeedbackMessages = new List<string> { "💪 Keep practicing to score even higher next time!" };

            return View(result);
        }

        // ==================== OTHER PAGES ====================
        public IActionResult About() => View();

        [HttpPost]
        public IActionResult RetryQuiz(int quizId)
        {
            TempData.Remove("SelectedAnswers");
            return RedirectToAction("StartQuiz", new { id = quizId, questionIndex = 0 });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            var requestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            _logger.LogError("Error page displayed for RequestId: {RequestId}", requestId);
            return View(new ErrorViewModel { RequestId = requestId });
        }
    }
}
