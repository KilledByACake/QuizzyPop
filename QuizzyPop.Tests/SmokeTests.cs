using Xunit;

namespace QuizzyPop.Tests;

// Simple smoke test to verify the test infrastructure is working
public class SmokeTests
{
    // Scenario: basic assertion to confirm the test framework is wired up correctly
    [Fact]
    public void It_Works()
    {
        // Arrange / Act
        var sum = 1 + 1;

        // Assert
        Assert.True(sum == 2);
    }
}
