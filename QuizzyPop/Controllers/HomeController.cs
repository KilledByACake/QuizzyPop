using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using QuizzyPop.Models;
using QuizzyPop.ViewModels;

namespace QuizzyPop.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

     public IActionResult CreateQuiz()
    {
        return View();
    }

    public IActionResult TakeQuiz()
    {
        return View();
    }

    public IActionResult Create()
    {
        var model = new QuizMetaDataViewModel
        {
            Questions = new List<QuizQuestionViewModel>
            {
                new QuizQuestionViewModel() // Empty question object
            }
        };
        return View("CreateQuiz", model);
    }
}
