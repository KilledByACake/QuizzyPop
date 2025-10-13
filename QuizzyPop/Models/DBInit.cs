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
                new User { Email = "Knut.knutson@gmail.com",
                Password = "Knut1234",
                Role = "student",
                Phone = "99999999",
                Birthdate = new DateTime(2018, 8, 20)},

                new User { Email = "Jan.oslo-skole@gmail.com",
                Password = "Volvo1234",
                Role = "teacher",
                Phone = "99999998",
                Birthdate = new DateTime(1980, 12, 12)}
            };

            context.AddRange(users);
            context.SaveChanges();
        }

        if (!context.Quiz.Any())
        {
            var quizzes = new List<Quiz>
            {
                new Quiz { Title = "Geometry",
                Description = "A simple quiz about basic geometry",
                Difficulty = "easy",}
            };

            context.AddRange(quizzes);
            context.SaveChanges();
        }
    }
}