using Microsoft.EntityFrameworkCore;

namespace QuizzyPop.Models;

public class UserDbContext : DbContext
{
	public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
	{
		//Database.EnsureCreated();
	}
	
	 protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseLazyLoadingProxies();
    }

	public DbSet<User> Users { get; set; }
}