using FluentValidation;
using QuizzyPop.Models.Dtos;

namespace QuizzyPop.Validators
{
    public class QuizUpdateDtoValidator : AbstractValidator<QuizUpdateDto>
    {
        public QuizUpdateDtoValidator()
        {
            RuleFor(q => q.Title)
                .NotEmpty().WithMessage("Title is required")
                .MinimumLength(3).WithMessage("Title must be at least 3 characters");

            RuleFor(q => q.Description)
                .MaximumLength(500).WithMessage("Description can be at most 500 characters");

            RuleFor(q => q.CategoryId)
                .GreaterThan(0).WithMessage("CategoryId must be valid");

            RuleFor(q => q.Difficulty)
                .Must(d => string.IsNullOrEmpty(d) || new[] { "easy", "medium", "hard" }.Contains(d.ToLower()))
                .WithMessage("Difficulty must be 'easy', 'medium', or 'hard' if provided");
        }
    }
}
