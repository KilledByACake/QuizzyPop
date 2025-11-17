namespace QuizzyPop.Models;
using System;
using System.Collections.Generic; // Ensure this is included for List<T>

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;

    public string Role { get; set; } = "student"; // student, teacher, admin
    public string? Phone { get; set; }
    public string? DisplayName { get; set; }
    public int? QuizzesCreated { get; set; }
    public int? QuizzesTaken { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Quizzes created by the user
    public List<Quiz> CreatedQuizzes { get; set; } = new();

    public byte[] PasswordHash { get; set; } = Array.Empty<byte>();
    public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();

    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}