using Microsoft.EntityFrameworkCore;

namespace QuizzyPop.Models;

public class UserDbContext : DbContext
{
	public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
	{
		//Database.EnsureCreated();
	}

	public DbSet<User> Users { get; set; }
	public DbSet<Quiz> Quiz { get; set; }
	public DbSet<Category> Categories { get; set; }
	public DbSet<Question> Questions { get; set; }
}