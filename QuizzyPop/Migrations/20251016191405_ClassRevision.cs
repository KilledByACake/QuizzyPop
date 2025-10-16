using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizzyPop.Migrations
{
    /// <inheritdoc />
    public partial class ClassRevision : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Birthdate",
                table: "Users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Birthdate",
                table: "Users",
                type: "TEXT",
                nullable: true);
        }
    }
}
