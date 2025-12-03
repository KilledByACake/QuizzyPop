using Microsoft.EntityFrameworkCore;
using QuizzyPop.Models;
using QuizzyPop.Services;

namespace QuizzyPop.DAL;

// Database seeding helper for development/local environment (demo users, categories, quizzes)
public static class DBInit
{
    public static void Seed(IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.CreateScope();
        var context = serviceScope.ServiceProvider.GetRequiredService<UserDbContext>();

        // Ensure the schema exists before any queries
        context.Database.EnsureCreated();

        // Seed demo users if none exist
        if (!context.Users.Any())
        {
            var demoUsers = new[]
            {
                new { Email = "demo@quizzypop.com", Role = "student", Password = "Demo12345" },
                new { Email = "test@quizzypop.com", Role = "teacher", Password = "Test12345" },
                new { Email = "admin@quizzypop.com", Role = "admin",   Password = "Admin12345" }
            };

            foreach (var demo in demoUsers)
            {
                PasswordHasher.CreateHash(demo.Password, out var hash, out var salt);

                var user = new User
                {
                    Email        = demo.Email,
                    Role         = demo.Role,
                    PasswordHash = hash,
                    PasswordSalt = salt
                };

                context.Users.Add(user);
            }

            // context.AddRange(user); // left commented out on purpose – users are added individually above
            
            context.SaveChanges();
        }

        // Seed default categories if none exist
        if (!context.Categories.Any())
        {
            var categories = new List<Category>
            {
                new Category { Name = "Math",
                Description = "Quizzes about numbers and calculations" },
                new Category { Name = "Entertainment",
                Description = "Quizzes about movies, music and pop culture" },
                new Category { Name = "History",
                Description = "Quizzes about historical events and figures" },
                new Category { Name = "Science",
                Description = "Quizzes about biology, chemistry, physics and more" },
                new Category { Name = "Geography",
                Description = "Quizzes about countries, cities and landmarks" }, 
            };
            context.AddRange(categories);
            context.SaveChanges();
        }

        // Seed sample quizzes with questions if none exist
        if (!context.Quiz.Any())
        {
            var cat1 = context.Categories.First(c => c.Name == "Math");
            var cat2 = context.Categories.First(c => c.Name == "Entertainment");

            var quizzes = new List<Quiz>
            {
                new Quiz {
                    Title = "Geometry",
                    Description = "A simple quiz about basic geometry",
                    Difficulty = "medium",
                    CategoryId = cat1.Id,
                    ImageUrl = "/images/geometry.jpeg",
                    UserId = 1,
                    Questions = new List<Question>
                    {
                        new Question
                        {
                            Text = "What is the sum of the interior angles of a triangle?",
                            Choices = new List<string> { "90 degrees", "180 degrees", "270 degrees", "360 degrees" },
                            CorrectAnswerIndex = 1
                        },
                        new Question
                        {
                            Text = "What is the area of a circle with radius r?",
                            Choices = new List<string> { "πr", "2πr", "πr²", "2r²" },
                            CorrectAnswerIndex = 2
                        },
                        new Question
                        {
                            Text = "What do you call a polygon with eight sides?",
                            Choices = new List<string> { "Hexagon", "Heptagon", "Octagon", "Nonagon" },
                            CorrectAnswerIndex = 2
                        }
                    }
                },
                new Quiz
                    {
                        Title = "Disney Characters",
                        Description = "Test your knowledge about Disney Characters!",
                        Difficulty = "easy",
                        CategoryId = cat2.Id,
                        ImageUrl = "/images/disney.webp",
                        UserId = 1,
                        Questions = new List<Question>
                        {
                            new Question
                            {
                                Text = "Who is the main character in 'The Little Mermaid'?",
                                Choices = new List<string> { "Belle", "Ariel", "Cinderella", "Jasmine" },
                                CorrectAnswerIndex = 1
                            },
                            new Question
                            {
                                Text = "Which Disney movie features a wooden puppet named Pinocchio?",
                                Choices = new List<string> { "Mathias", "Mulan", "Hercules", "Pinnochio" },
                                CorrectAnswerIndex = 3
                            },
                            new Question
                            {
                                Text = "In 'The Lion King', what is the name of Simba's father?",
                                Choices = new List<string> { "Mufasa", "Scar", "Timon", "Pumbaa" },
                                CorrectAnswerIndex = 0
                            }
                        },
                    }
                };
            context.AddRange(quizzes);
            context.SaveChanges();
        }
    }
}