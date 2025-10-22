using Microsoft.EntityFrameworkCore;
using QuizzyPop.Models;

namespace QuizzyPop.DAL;

public static class DBInit
{
    public static void Seed(IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.CreateScope();
        UserDbContext context = serviceScope.ServiceProvider.GetRequiredService<UserDbContext>();
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
                new Quiz {
                    Title = "Geometry",
                    Description = "A simple quiz about basic geometry",
                    Difficulty = "medium",
                    CategoryId = 1,
                    ImageUrl = "images/geometry.jpeg",
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
                        CategoryId = 2,
                        ImageUrl = "images/disney.webp",
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