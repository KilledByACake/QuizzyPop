namespace QuizzyPop.Models;
using System;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    public string Role { get; set; } = "student"; // student, teacher, admin
    public string? Phone { get; set; }
    public DateTime? Birthdate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Quizzes created by the user
    public List<Quiz> Quizzes { get; set; } = new();
}