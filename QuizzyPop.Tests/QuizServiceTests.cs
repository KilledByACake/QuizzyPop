using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using QuizzyPop.DAL.Repositories;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;
using QuizzyPop.Services;
using Xunit;

namespace QuizzyPop.Tests;

public class QuizServiceTests
{
    private readonly Mock<IQuizRepository> _repoMock;
    private readonly QuizService _service;

    public QuizServiceTests()
    {
        _repoMock = new Mock<IQuizRepository>();
        _service = new QuizService(_repoMock.Object, NullLogger<QuizService>.Instance);
    }

    [Fact]
    public async Task CreateQuiz_ValidDto_ReturnsCreatedQuiz()
    {
        // arrange
        var dto = new QuizCreateDto
        {
            Title = "Math quiz",
            Description = "Simple test",
            ImageUrl = null,
            Difficulty = "easy",
            CategoryId = 1,
            UserId = 1
        };

        var created = new Quiz
        {
            Id = 1,
            Title = dto.Title,
            Description = dto.Description,
            Difficulty = dto.Difficulty,
            CategoryId = dto.CategoryId,
            UserId = dto.UserId
        };

        _repoMock
            .Setup(r => r.AddAsync(It.IsAny<Quiz>()))
            .ReturnsAsync(created);

        // act
        var result = await _service.CreateAsync(dto);

        // assert
        result.Should().NotBeNull();
        result.Id.Should().Be(1);
        result.Title.Should().Be("Math quiz");

        _repoMock.Verify(r =>
            r.AddAsync(It.Is<Quiz>(q =>
                q.Title == dto.Title &&
                q.CategoryId == dto.CategoryId &&
                q.UserId == dto.UserId
            )),
            Times.Once);
    }

    [Fact]
    public async Task CreateQuiz_EmptyTitle_ThrowsArgumentException()
    {
        var dto = new QuizCreateDto
        {
            Title = "   ",
            Description = "desc",
            ImageUrl = null,
            Difficulty = "easy",
            CategoryId = 1,
            UserId = 1
        };

        var act = async () => await _service.CreateAsync(dto);

        await act.Should().ThrowAsync<ArgumentException>();
        _repoMock.Verify(r => r.AddAsync(It.IsAny<Quiz>()), Times.Never);
    }

    [Fact]
    public async Task GetQuizById_ExistingId_ReturnsQuiz()
    {
        var quiz = new Quiz { Id = 5, Title = "Existing", CategoryId = 1, UserId = 1 };

        _repoMock
            .Setup(r => r.GetByIdAsync(5))
            .ReturnsAsync(quiz);

        var result = await _service.GetAsync(5);

        result.Should().NotBeNull();
        result!.Id.Should().Be(5);
        result.Title.Should().Be("Existing");
    }

    [Fact]
    public async Task GetQuizById_NonExistingId_ReturnsNull()
    {
        _repoMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync((Quiz?)null);

        var result = await _service.GetAsync(999);

        result.Should().BeNull();
    }

    [Fact]
    public async Task ListQuizzes_ReturnsAllQuizzes()
    {
        var quizzes = new List<Quiz>
        {
            new Quiz { Id = 1, Title = "Q1", CategoryId = 1, UserId = 1 },
            new Quiz { Id = 2, Title = "Q2", CategoryId = 1, UserId = 1 }
        };

        _repoMock
            .Setup(r => r.GetAllWithDetailsAsync())
            .ReturnsAsync(quizzes);

        var result = await _service.ListAsync();

        result.Should().HaveCount(2);
        result.Select(q => q.Title).Should().Contain(new[] { "Q1", "Q2" });
    }

    [Fact]
    public async Task GetQuizWithQuestions_IncludesQuestions()
    {
        var quiz = new Quiz
        {
            Id = 10,
            Title = "History",
            CategoryId = 1,
            UserId = 1,
            Questions = new List<Question>
            {
                new Question
                {
                    Id = 1,
                    Text = "When did WW2 end?",
                    Choices = new List<string> { "1945", "1939" },
                    CorrectAnswerIndex = 0
                }
            }
        };

        _repoMock
            .Setup(r => r.GetQuizWithQuestionsAsync(10))
            .ReturnsAsync(quiz);

        var loaded = await _service.GetWithQuestionsAsync(10);

        loaded.Should().NotBeNull();
        loaded!.Questions.Should().HaveCount(1);
        loaded.Questions.First().Text.Should().Contain("WW2");
    }

    [Fact]
    public async Task UpdateQuiz_ValidData_ReturnsTrue()
    {
        var quiz = new Quiz
        {
            Id = 3,
            Title = "Old",
            Description = "Old desc",
            CategoryId = 1,
            UserId = 1
        };

        _repoMock
            .Setup(r => r.GetByIdAsync(3))
            .ReturnsAsync(quiz);

        _repoMock
            .Setup(r => r.UpdateAsync(It.IsAny<Quiz>()))
            .ReturnsAsync(true);

        var dto = new QuizUpdateDto
        {
            Title = "New",
            Description = "Updated",
            ImageUrl = null,
            Difficulty = "medium",
            CategoryId = 2
        };

        var result = await _service.UpdateAsync(3, dto);

        result.Should().BeTrue();

        _repoMock.Verify(r => r.UpdateAsync(It.Is<Quiz>(q =>
            q.Id == 3 &&
            q.Title == "New" &&
            q.CategoryId == 2
        )), Times.Once);
    }

    [Fact]
    public async Task UpdateQuiz_NonExistingId_ReturnsFalse()
    {
        _repoMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync((Quiz?)null);

        var dto = new QuizUpdateDto
        {
            Title = "Does not matter",
            Description = null,
            ImageUrl = null,
            Difficulty = "easy",
            CategoryId = 1
        };

        var result = await _service.UpdateAsync(999, dto);

        result.Should().BeFalse();
        _repoMock.Verify(r => r.UpdateAsync(It.IsAny<Quiz>()), Times.Never);
    }

    [Fact]
    public async Task DeleteQuiz_ExistingId_ReturnsTrue()
    {
        _repoMock
            .Setup(r => r.DeleteAsync(5))
            .ReturnsAsync(true);

        var result = await _service.DeleteAsync(5);

        result.Should().BeTrue();
        _repoMock.Verify(r => r.DeleteAsync(5), Times.Once);
    }

    [Fact]
    public async Task DeleteQuiz_NonExistingId_ReturnsFalse()
    {
        _repoMock
            .Setup(r => r.DeleteAsync(It.IsAny<int>()))
            .ReturnsAsync(false);

        var result = await _service.DeleteAsync(999);

        result.Should().BeFalse();
    }
}
