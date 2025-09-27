using Microsoft.AspNetCore.Mvc;
using QuizzyPop.ViewModels;

namespace QuizzyPop.Controllers
{
    public class QuizzesController : Controller
    {
        [HttpGet]
        public IActionResult Create()
        {
            var model = new CreateQuizViewModel();
            return View("~/Views/Home/CreateQuiz.cshtml", model);
        }

        [HttpPost]
        public IActionResult Create(CreateQuizViewModel model)
        {
            // Save logic here
            return View("~/Views/Home/CreateQuiz.cshtml", model);
        }
    }
}