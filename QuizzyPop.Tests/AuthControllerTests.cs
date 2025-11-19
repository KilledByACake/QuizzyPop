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

public class AuthControllerTests
{
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

    [Fact]
    public async Task RegisterUser_ValidEmail_CreatesUser()
    {
        var options = new DbContextOptionsBuilder<UserDbContext>()
            .UseInMemoryDatabase($"AuthTestDb_{Guid.NewGuid()}")
            .Options;

        using var db = new UserDbContext(options);
        var controller = CreateController(db);

        var req = new RegisterRequest(
            "test@example.com",
            "Pass123!",
            "student"
        );

        var result = await controller.Register(req);

        result.Should().BeOfType<CreatedAtActionResult>();
        db.Users.Single().Email.Should().Be("test@example.com");
    }

    [Fact]
    public async Task RegisterUser_DuplicateEmail_ReturnsConflict()
    {
        var options = new DbContextOptionsBuilder<UserDbContext>()
            .UseInMemoryDatabase($"AuthTestDb_{Guid.NewGuid()}")
            .Options;

        using var db = new UserDbContext(options);
        db.Users.Add(new User { Email = "existing@example.com" });
        await db.SaveChangesAsync();

        var controller = CreateController(db);

        var req = new RegisterRequest(
            "existing@example.com",
            "Pass123!",
            "student"
        );

        var result = await controller.Register(req);

        result.Should().BeOfType<ConflictObjectResult>();
    }
}
