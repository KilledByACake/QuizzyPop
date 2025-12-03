using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moq;
using QuizzyPop.Api.Controllers;
using QuizzyPop.Api.Options;
using QuizzyPop.DAL;
using QuizzyPop.Models;
using QuizzyPop.Models.Dtos;
using QuizzyPop.Services;
using Xunit;

namespace QuizzyPop.Tests;

// Tests for AuthController registration behavior (success and duplicate email)
public class AuthControllerTests
{
    // Helper for creating an AuthController with test JWT settings and mocked token service
    private static AuthController CreateController(UserDbContext db)
    {
        var jwtSettings = Options.Create(new JwtSettings
        {
            Key = "super_secret_test_key_1234567890",
            Issuer = "test",
            Audience = "test",
            AccessTokenMinutes = 15,
            RefreshTokenDays = 7
        });

        var tokenService = new Mock<IJwtTokenService>();

        return new AuthController(tokenService.Object, db, jwtSettings);
    }

    // Scenario: registering a user with a unique email should create and persist the user
    [Fact]
    public async Task RegisterUser_ValidEmail_CreatesUser()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<UserDbContext>()
        // Use a unique in-memory database per test run to avoid data leaking between tests
            .UseInMemoryDatabase($"AuthTestDb_{Guid.NewGuid()}")
            .Options;

        using var db = new UserDbContext(options);
        var controller = CreateController(db);

        var req = new RegisterRequest(
            "test@example.com",
            "Pass123!",
            "student"
        );

        // Act
        var result = await controller.Register(req);

        // Assert
        result.Should().BeOfType<CreatedAtActionResult>();
        db.Users.Single().Email.Should().Be("test@example.com");
    }

    // Scenario: registering with an email that already exists should return 409 Conflict
    [Fact]
    public async Task RegisterUser_DuplicateEmail_ReturnsConflict()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<UserDbContext>()
            .UseInMemoryDatabase($"AuthTestDb_{Guid.NewGuid()}")
            .Options;

        using var db = new UserDbContext(options);

        // Seed an existing user so the controller hits the "duplicate email" path
        db.Users.Add(new User { Email = "existing@example.com" });
        await db.SaveChangesAsync();

        var controller = CreateController(db);

        var req = new RegisterRequest(
            "existing@example.com",
            "Pass123!",
            "student"
        );
        // Act
        var result = await controller.Register(req);

        // Assert
        result.Should().BeOfType<ConflictObjectResult>();
    }
}
