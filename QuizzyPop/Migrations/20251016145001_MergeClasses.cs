using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizzyPop.Migrations
{
    /// <inheritdoc />
    public partial class MergeClasses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeLimit",
                table: "Quiz");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DisplayName",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "QuizzesCreated",
                table: "Users",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuizzesTaken",
                table: "Users",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Quiz",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DisplayName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "QuizzesCreated",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "QuizzesTaken",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Quiz");

            migrationBuilder.AddColumn<int>(
                name: "TimeLimit",
                table: "Quiz",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
