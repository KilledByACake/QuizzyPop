using Microsoft.EntityFrameworkCore;

namespace QuizzyPop.Models;

public static class DBInit
{
    public static void Seed(IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.CreateScope();
        UserDbContext context = serviceScope.ServiceProvider.GetRequiredService<UserDbContext>();
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();

        if (!context.Users.Any())
        {
            var users = new List<User>
            {
                new User {
                    Email = "demo@quizzypop.com",
                    Name = "Demo User",
                    Role = "student",
                    DisplayName = "Demo User",
                    QuizzesCreated = 5,
                    QuizzesTaken = 12
                },

                new User {
                    Email = "test@quizzypop.com",
                    Name = "Test User",
                    Role = "teacher",
                    DisplayName = "Test User",
                    QuizzesCreated = 3,
                    QuizzesTaken = 8
                },

                new User {
                    Email = "admin@quizzypop.com",
                    Name = "Admin User",
                    Role = "admin",
                    DisplayName = "Admin User",
                    QuizzesCreated = 15,
                    QuizzesTaken = 25
                }      
            };

            context.AddRange(users);
            context.SaveChanges();
        }

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
            };
            context.AddRange(categories);
            context.SaveChanges();
        }

        if (!context.Quiz.Any())
        {
            var quizzes = new List<Quiz>
            {
                new Quiz { Title = "Geometry",
                    Description = "A simple quiz about basic geometry",
                    Difficulty = "medium",
                    CategoryId = 1,
                    ImageUrl = "images/geometry.jpeg",
                    UserId = 1 },

                new Quiz {
                    Title = "Disney Characters",
                    Description = "Test your knowledge about Disney Characters!",
                    Difficulty = "easy",
                    CategoryId = 2,
                    ImageUrl = "images/disney.webp",
                    UserId = 1 }
            };

            context.AddRange(quizzes);
            context.SaveChanges();
        }

        if (!context.Questions.Any())
        {
            var questions = new List<Question>
            {
                new Question {
                    QuizId = 1,
                    Text = "What is the sum of the interior angles of a triangle?",
                    CorrectAnswer = "180 degrees",
                },
                new Question {
                    QuizId = 1,
                    Text = "What do you call a polygon with eight sides?",
                    CorrectAnswer = "Octagon",
                },
                new Question {
                    QuizId = 2,
                    Text = "Who is the main antagonist in 'The Lion King'?",
                    CorrectAnswer = "Scar",
                },
                new Question {
                    QuizId = 2,
                    Text = "In 'Aladdin', what is the name of Jasmine's pet tiger?",
                    CorrectAnswer = "Rajah",
                }
            };

            context.AddRange(questions);
            context.SaveChanges();
        }
    }
}