using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizzyPop.Migrations
{
    /// <inheritdoc />
    public partial class UserIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quiz_Users_UserId",
                table: "Quiz");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Quiz",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_Quiz_Users_UserId",
                table: "Quiz",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quiz_Users_UserId",
                table: "Quiz");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Quiz",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Quiz_Users_UserId",
                table: "Quiz",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
