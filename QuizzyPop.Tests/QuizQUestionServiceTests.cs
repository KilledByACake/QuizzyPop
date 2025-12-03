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

// Tests for QuizQuestionService CRUD operations for quiz questions
public class QuizQuestionServiceTests
{
    private readonly Mock<IQuestionRepository> _questionRepoMock;
    private readonly Mock<IQuizRepository> _quizRepoMock;
    private readonly QuizQuestionService _service;

    public QuizQuestionServiceTests()
    {
        _questionRepoMock = new Mock<IQuestionRepository>();
        _quizRepoMock = new Mock<IQuizRepository>();
        _service = new QuizQuestionService(
            _questionRepoMock.Object,
            _quizRepoMock.Object,
            NullLogger<QuizQuestionService>.Instance
        );
    }

     // Scenario: creating a question with valid data should return the created question and use the repository to persist it
    [Fact]
    public async Task CreateQuestion_ValidData_ReturnsCreatedQuestion()
    {
        // Arrange - setup test data
        var dto = new QuizQuestionCreateDto
        {
            QuizId = 1,
            Text = "What is 2 + 2?",
            Choices = new List<string> { "3", "4", "5", "6" },
            CorrectAnswerIndex = 1
        };

        var quiz = new Quiz
        {
            Id = 1,
            Title = "Math Quiz",
            CategoryId = 1,
            UserId = 1
        };

        // Quiz with the given id exists
        _quizRepoMock
            .Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(quiz);

        // Return the same question that was passed in to simulate successful persistence
        _questionRepoMock
            .Setup(r => r.AddAsync(It.IsAny<Question>()))
            .ReturnsAsync((Question q) => q);

        // Act - call the method
        var result = await _service.CreateAsync(dto);

        // Assert - verify results
        result.Should().NotBeNull();
        result.Text.Should().Be("What is 2 + 2?");
        result.Choices.Should().HaveCount(4);
        result.Choices[1].Should().Be("4");
        result.CorrectAnswerIndex.Should().Be(1);
        result.QuizId.Should().Be(1);

        // Ensure repository was called with the expected entity
        _questionRepoMock.Verify(r => r.AddAsync(It.Is<Question>(q =>
            q.Text == dto.Text &&
            q.QuizId == dto.QuizId &&
            q.Choices.Count == 4
        )), Times.Once);
    }

    // Scenario: creating a question with empty text should throw and never call the repository
    [Fact]
    public async Task CreateQuestion_EmptyText_ThrowsArgumentException()
    {
        // Arrange
        var dto = new QuizQuestionCreateDto
        {
            QuizId = 1,
            Text = "   ", // Empty/whitespace text
            Choices = new List<string> { "A", "B" },
            CorrectAnswerIndex = 0
        };

        // Act
        var act = async () => await _service.CreateAsync(dto);

        // Assert - should throw exception
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Text is required*");

        // Verify repository was never called
        _questionRepoMock.Verify(r => r.AddAsync(It.IsAny<Question>()), Times.Never);
    }

    // Scenario: creating a question with fewer than two choices should throw
    [Fact]
    public async Task CreateQuestion_LessThanTwoChoices_ThrowsArgumentException()
    {
        // Arrange
        var dto = new QuizQuestionCreateDto
        {
            QuizId = 1,
            Text = "Valid question?",
            Choices = new List<string> { "Only one choice" }, // Not enough choices
            CorrectAnswerIndex = 0
        };

        var quiz = new Quiz { Id = 1, Title = "Test", CategoryId = 1, UserId = 1 };
        _quizRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(quiz);

        // Act
        var act = async () => await _service.CreateAsync(dto);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*at least two choices*");
    }

    // Scenario: getting a question by an existing id should return the question
    [Fact]
    public async Task GetQuestion_ExistingId_ReturnsQuestion()
    {
        // Arrange
        var question = new Question
        {
            Id = 5,
            QuizId = 1,
            Text = "What is the capital of France?",
            Choices = new List<string> { "Paris", "London", "Berlin", "Madrid" },
            CorrectAnswerIndex = 0
        };

        _questionRepoMock
            .Setup(r => r.GetByIdAsync(5))
            .ReturnsAsync(question);

        // Act
        var result = await _service.GetAsync(5);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(5);
        result.Text.Should().Contain("France");
        result.Choices.Should().HaveCount(4);
    }

    // Scenario: getting a question by a non-existing id should return null
    [Fact]
    public async Task GetQuestion_NonExistingId_ReturnsNull()
    {
        // Arrange
        _questionRepoMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync((Question?)null);

        // Act
        var result = await _service.GetAsync(999);

        // Assert
        result.Should().BeNull();
    }

    // Scenario: updating an existing question with valid data should return true and update the stored entity
    [Fact]
    public async Task UpdateQuestion_ValidData_ReturnsTrue()
    {
        // Arrange
        var existing = new Question
        {
            Id = 3,
            QuizId = 1,
            Text = "Old question",
            Choices = new List<string> { "A", "B" },
            CorrectAnswerIndex = 0
        };

        _questionRepoMock
            .Setup(r => r.GetByIdAsync(3))
            .ReturnsAsync(existing);

        _questionRepoMock
            .Setup(r => r.UpdateAsync(It.IsAny<Question>()))
            .ReturnsAsync(true);

        var dto = new QuizQuestionUpdateDto
        {
            Text = "Updated question",
            Choices = new List<string> { "New A", "New B", "New C" },
            CorrectAnswerIndex = 2
        };

        // Act
        var result = await _service.UpdateAsync(3, dto);

        // Assert
        result.Should().BeTrue();

        _questionRepoMock.Verify(r => r.UpdateAsync(It.Is<Question>(q =>
            q.Id == 3 &&
            q.Text == "Updated question" &&
            q.Choices.Count == 3 &&
            q.CorrectAnswerIndex == 2
        )), Times.Once);
    }

    // Scenario: updating a non-existing question should return false and not call Update on the repository
    [Fact]
    public async Task UpdateQuestion_NonExistingId_ReturnsFalse()
    {
        // Arrange
        _questionRepoMock
            .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync((Question?)null);

        var dto = new QuizQuestionUpdateDto
        {
            Text = "Doesn't matter"
        };

        // Act
        var result = await _service.UpdateAsync(999, dto);

        // Assert
        result.Should().BeFalse();
        _questionRepoMock.Verify(r => r.UpdateAsync(It.IsAny<Question>()), Times.Never);
    }

    // Scenario: deleting an existing question should return true and call Delete on the repository
    [Fact]
    public async Task DeleteQuestion_ExistingId_ReturnsTrue()
    {
        // Arrange
        _questionRepoMock
            .Setup(r => r.DeleteAsync(7))
            .ReturnsAsync(true);

        // Act
        var result = await _service.DeleteAsync(7);

        // Assert
        result.Should().BeTrue();
        _questionRepoMock.Verify(r => r.DeleteAsync(7), Times.Once);
    }

    // Scenario: deleting a non-existing question should return false
    [Fact]
    public async Task DeleteQuestion_NonExistingId_ReturnsFalse()
    {
        // Arrange
        _questionRepoMock
            .Setup(r => r.DeleteAsync(It.IsAny<int>()))
            .ReturnsAsync(false);

        // Act
        var result = await _service.DeleteAsync(999);

        // Assert
        result.Should().BeFalse();
    }

    // Scenario: listing questions by quiz id should return all questions for that quiz
    [Fact]
    public async Task ListByQuiz_ReturnsAllQuestionsForQuiz()
    {
        // Arrange
        var questions = new List<Question>
        {
            new Question
            {
                Id = 1,
                QuizId = 5,
                Text = "Question 1",
                Choices = new List<string> { "A", "B" },
                CorrectAnswerIndex = 0
            },
            new Question
            {
                Id = 2,
                QuizId = 5,
                Text = "Question 2",
                Choices = new List<string> { "C", "D" },
                CorrectAnswerIndex = 1
            }
        };

        _questionRepoMock
            .Setup(r => r.GetByQuizIdAsync(5))
            .ReturnsAsync(questions);

        // Act
        var result = await _service.ListByQuizAsync(5);

        // Assert
        result.Should().HaveCount(2);
        result.All(q => q.QuizId == 5).Should().BeTrue();
        result.Select(q => q.Text).Should().Contain(new[] { "Question 1", "Question 2" });
    }
}