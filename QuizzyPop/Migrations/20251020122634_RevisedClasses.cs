using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizzyPop.Migrations
{
    /// <inheritdoc />
    public partial class RevisedClasses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnswerExplanation",
                table: "Questions");

            migrationBuilder.RenameColumn(
                name: "CorrectAnswer",
                table: "Questions",
                newName: "Choices");

            migrationBuilder.AddColumn<int>(
                name: "CorrectAnswerIndex",
                table: "Questions",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CorrectAnswerIndex",
                table: "Questions");

            migrationBuilder.RenameColumn(
                name: "Choices",
                table: "Questions",
                newName: "CorrectAnswer");

            migrationBuilder.AddColumn<string>(
                name: "AnswerExplanation",
                table: "Questions",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
