using Microsoft.AspNetCore.Mvc;
using QuizzyPop.ViewModels;
// using QuizzyPop.Data; using QuizzyPop.Domain; // your repos/services

namespace QuizzyPop.Controllers;

public class QuizzesController : Controller
{
    // inject repositories/services here
    // private readonly IQuizRepository _quizzes;

    public QuizzesController(/*IQuizRepository quizzes*/) /*=> _quizzes = quizzes;*/ { }

    // LIST
    [HttpGet]
    public IActionResult Index()
    {
        // var items = await _quizzes.GetAllAsync();
        // return View(items);
        return View(); // bind later
    }

    // DETAILS / OVERVIEW (before taking)
    [HttpGet]
    public IActionResult Details(int id)
    {
        // var vm = await _quizzes.GetDetailsVmAsync(id);
        // if (vm is null) return NotFound();
        return View(/*vm*/);
    }

    // CREATE (GET)
    [HttpGet]
    public IActionResult Create()
    {
        var vm = new CreateQuizViewModel();
        return View(vm); // Views/Quizzes/Create.cshtml
    }

    // CREATE (POST)
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Create(CreateQuizViewModel model)
    {
        if (!ModelState.IsValid) return View(model);

        // Map model.MetaData + model.Questions -> domain; save
        // var id = await _quizzes.CreateAsync(domain);
        TempData["Success"] = "Quiz created!";
        return RedirectToAction(nameof(Index)); // or Details, passing id
    }

    // EDIT (optional for MVP)
    [HttpGet]
    public IActionResult Edit(int id) { /* load and return View */ return View(); }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Edit(int id, CreateQuizViewModel model)
    {
        if (!ModelState.IsValid) return View(model);
        // save
        TempData["Success"] = "Quiz updated!";
        return RedirectToAction(nameof(Details), new { id });
    }

    // PLAY (take quiz)
    [HttpGet]
    public IActionResult Play(int id, int q = 1)
    {
        // load quiz + question q → ViewModel
        return View(/*playerVm*/); // Views/Quizzes/Play.cshtml
    }

    // SUBMIT ANSWERS
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Submit([FromForm] /*AttemptPostVm*/ object attempt)
    {
        // grade, store result, get resultId
        return RedirectToAction(nameof(Result) /*, new { id = resultId }*/);
    }

    // RESULT
    [HttpGet]
    public IActionResult Result(int id)
    {
        // var vm = await _quizzes.GetResultVmAsync(id);
        return View(/*vm*/); // Views/Quizzes/Result.cshtml
    }
}
