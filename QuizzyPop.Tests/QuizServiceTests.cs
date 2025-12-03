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

// Tests for QuizService CRUD operations and quiz retrieval including questions
public class QuizServiceTests
{
    private readonly Mock<IQuizRepository> _repoMock;
    private readonly QuizService _service;

    public QuizServiceTests()
    {
        _repoMock = new Mock<IQuizRepository>();
        _service = new QuizService(_repoMock.Object, NullLogger<QuizService>.Instance);
    }

    // Scenario: creating a quiz with valid data should persist and return the created quiz
    [Fact]
    public async Task CreateQuiz_ValidDto_ReturnsCreatedQuiz()
    {
        // Arrange
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

        // Return the created quiz entity to simulate successful persistence
        _repoMock
            .Setup(r => r.AddAsync(It.IsAny<Quiz>()))
            .ReturnsAsync(created);

        // Act
        var result = await _service.CreateAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(1);
        result.Title.Should().Be("Math quiz");

        // Ensure repository was called with the expected values
        _repoMock.Verify(r =>
            r.AddAsync(It.Is<Quiz>(q =>
                q.Title == dto.Title &&
                q.CategoryId == dto.CategoryId &&
                q.UserId == dto.UserId
            )),
            Times.Once);
    }

    // Scenario: creating a quiz with an empty title should throw and never call the repository
    [Fact]
    public async Task CreateQuiz_EmptyTitle_ThrowsArgumentException()
    {
        // Arrange
        var dto = new QuizCreateDto
        {
            Title = "   ",
            Description = "desc",
            ImageUrl = null,
            Difficulty = "easy",
            CategoryId = 1,
            UserId = 1
        };

        //Act
        var act = async () => await _service.CreateAsync(dto);
        
        // Assert
        await act.Should().ThrowAsync<ArgumentException>();
        _repoMock.Verify(r => r.AddAsync(It.IsAny<Quiz>()), Times.Never);
    }

    // Scenario: getting a quiz by an existing id should return the quiz
    [Fact]
    public async Task GetQuizById_ExistingId_ReturnsQuiz()
    {
        // Arrange
        var quiz = new Quiz { Id = 5, Title = "Existing", CategoryId = 1, UserId = 1 };

        _repoMock
            .Setup(r => r.GetByIdAsync(5))
            .ReturnsAsync(quiz);

        // Act
        var result = await _service.GetAsync(5);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(5);
        result.Title.Should().Be("Existing");
    }

    // Scenario: getting a quiz by a non-existing id should return null
    [Fact]
    public async Task GetQuizById_NonExistingId_ReturnsNull()
    {
        // Arrange
        _repoMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync((Quiz?)null);
        // Act
        var result = await _service.GetAsync(999);

        // Assert
        result.Should().BeNull();
    }

    // Scenario: listing quizzes should return all quizzes from the repository
    [Fact]
    public async Task ListQuizzes_ReturnsAllQuizzes()
    {
        //Arrange
        var quizzes = new List<Quiz>
        {
            new Quiz { Id = 1, Title = "Q1", CategoryId = 1, UserId = 1 },
            new Quiz { Id = 2, Title = "Q2", CategoryId = 1, UserId = 1 }
        };

        _repoMock
            .Setup(r => r.GetAllWithDetailsAsync())
            .ReturnsAsync(quizzes);
        // Act
        var result = await _service.ListAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Select(q => q.Title).Should().Contain(new[] { "Q1", "Q2" });
    }

    // Scenario: getting a quiz with questions should return the quiz including its questions
    [Fact]
    public async Task GetQuizWithQuestions_IncludesQuestions()
    {
        // Arrange
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
        // Act
        var loaded = await _service.GetWithQuestionsAsync(10);

        // Assert
        loaded.Should().NotBeNull();
        loaded!.Questions.Should().HaveCount(1);
        loaded.Questions.First().Text.Should().Contain("WW2");
    }

    // Scenario: updating an existing quiz with valid data should return true and update the stored entity
    [Fact]
    public async Task UpdateQuiz_ValidData_ReturnsTrue()
    {
        // Arrange
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

        // Act
        var result = await _service.UpdateAsync(3, dto);
        
        // Assert
        result.Should().BeTrue();

        // Ensure repository was called with the updated values
        _repoMock.Verify(r => r.UpdateAsync(It.Is<Quiz>(q =>
            q.Id == 3 &&
            q.Title == "New" &&
            q.CategoryId == 2
        )), Times.Once);
    }

    // Scenario: updating a non-existing quiz should return false and not call Update on the repository
    [Fact]
    public async Task UpdateQuiz_NonExistingId_ReturnsFalse()
    {
        // Arrange
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

        // Act
        var result = await _service.UpdateAsync(999, dto);

        // Assert
        result.Should().BeFalse();
        _repoMock.Verify(r => r.UpdateAsync(It.IsAny<Quiz>()), Times.Never);
    }

    // Scenario: deleting an existing quiz should return true and call Delete on the repository
    [Fact]
    public async Task DeleteQuiz_ExistingId_ReturnsTrue()
    {
        // Arrange
        _repoMock
            .Setup(r => r.DeleteAsync(5))
            .ReturnsAsync(true);

        // Act
        var result = await _service.DeleteAsync(5);

        // Assert
        result.Should().BeTrue();
        _repoMock.Verify(r => r.DeleteAsync(5), Times.Once);
    }

    // Scenario: deleting a non-existing quiz should return false
    [Fact]
    public async Task DeleteQuiz_NonExistingId_ReturnsFalse()
    {
        // Arrange
        _repoMock
            .Setup(r => r.DeleteAsync(It.IsAny<int>()))
            .ReturnsAsync(false);
        
        // Act
        var result = await _service.DeleteAsync(999);

        // Assert
        result.Should().BeFalse();
    }
}
