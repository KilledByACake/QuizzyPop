using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;
using QuizzyPop.Models;


namespace QuizzyPop.DAL;

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
	public DbSet<Tag> Tags { get; set; }


	protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
		base.OnModelCreating(modelBuilder);
		
         modelBuilder.Entity<Question>()
        .Property(q => q.Choices)
		.HasConversion(
			v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
			v => JsonSerializer.Deserialize<List<string>>(v, new JsonSerializerOptions()) ?? new List<string>()
		);
		
		modelBuilder.Entity<RefreshToken>()
			.HasOne(rt => rt.User)
			.WithMany(u => u.RefreshTokens)
			.HasForeignKey(rt => rt.UserId)
			.OnDelete(DeleteBehavior.Cascade
		);

		modelBuilder.Entity<Quiz>()
			.HasMany(q => q.Tags)
			.WithMany(t => t.Quizzes)
			.UsingEntity<Dictionary<string, object>>(
			"QuizTags",
			j => j.HasOne<Tag>().WithMany().HasForeignKey("TagId"),
			j => j.HasOne<Quiz>().WithMany().HasForeignKey("QuizId")
		);
    }
	public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
}