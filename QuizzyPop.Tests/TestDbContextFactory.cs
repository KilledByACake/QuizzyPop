using System;
using Microsoft.EntityFrameworkCore;
using QuizzyPop.DAL;

namespace QuizzyPop.Tests;

public static class TestDbContextFactory
{
    public static UserDbContext CreateInMemory()
    {
        var options = new DbContextOptionsBuilder<UserDbContext>()
            .UseInMemoryDatabase(databaseName: $"QuizzyPop_TestDb_{Guid.NewGuid()}")
            .Options;

        return new UserDbContext(options);
    }
}
