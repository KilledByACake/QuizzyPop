using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;

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

	 protected override void OnModelCreating(ModelBuilder modelBuilder)
     {
		base.OnModelCreating(modelBuilder);
		
         modelBuilder.Entity<Question>()
             .Property(q => q.Choices)
             .HasConversion(
            	new ValueConverter<List<string>, string>(
            	v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null) ?? new List<string>()
					)
        		);
     }
}