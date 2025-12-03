using System;
using Microsoft.EntityFrameworkCore;
using QuizzyPop.DAL;

namespace QuizzyPop.Tests;

// Factory for creating in-memory UserDbContext instances for tests
public static class TestDbContextFactory
{
    public static UserDbContext CreateInMemory()
    {
        // Use a unique in-memory database name per context to avoid shared state between tests
        var options = new DbContextOptionsBuilder<UserDbContext>()
            .UseInMemoryDatabase(databaseName: $"QuizzyPop_TestDb_{Guid.NewGuid()}")
            .Options;

        return new UserDbContext(options);
    }
}
