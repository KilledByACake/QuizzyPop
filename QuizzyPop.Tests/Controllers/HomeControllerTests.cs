/*using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using QuizzyPop.Controllers;
using QuizzyPop.DAL;
using QuizzyPop.Models;
using QuizzyPop.ViewModels;

namespace QuizzyPop.Test.Controllers;

public class HomeControllerTest
{
    // code from chatGPT - only for testing
     private static HomeController CreateController()
    {
        // Using Moq because you already referenced it
        var loggerMock = new Mock<ILogger<HomeController>>();
        return new HomeController(loggerMock.Object);
    }

        [Fact]
        public void Index_Returns_Default_View()
        {
            var controller = CreateController();

            IActionResult result = controller.Index();

            var view = Assert.IsType<ViewResult>(result);
            // When you call View() without a name, ViewName is null
            Assert.True(string.IsNullOrEmpty(view.ViewName));
            Assert.Null(view.Model);
        }

        [Fact]
        public void CreateQuiz_Returns_Default_View()
        {
            var controller = CreateController();

            IActionResult result = controller.CreateQuiz();

            var view = Assert.IsType<ViewResult>(result);
            Assert.True(string.IsNullOrEmpty(view.ViewName));
            Assert.Null(view.Model);
        }

        [Fact]
        public void TakeQuiz_Returns_Default_View()
        {
            var controller = CreateController();

            IActionResult result = controller.TakeQuiz();

            var view = Assert.IsType<ViewResult>(result);
            Assert.True(string.IsNullOrEmpty(view.ViewName));
            Assert.Null(view.Model);
        }

        [Fact]
        public void Create_Returns_CreateQuiz_View_With_Initialized_Model()
        {
            var controller = CreateController();

            IActionResult result = controller.Create();

            var view = Assert.IsType<ViewResult>(result);
            Assert.Equal("CreateQuiz", view.ViewName);

            var model = Assert.IsType<QuizMetaDataViewModel>(view.Model);
            Assert.NotNull(model.Questions);
            Assert.Single(model.Questions);
            Assert.IsType<QuizQuestionViewModel>(model.Questions[0]);
        }
    
}
*/