using FluentValidation;
using QuizzyPop.Models.Dtos;

namespace QuizzyPop.Validators
{
    public class QuizQuestionCreateDtoValidator : AbstractValidator<QuizQuestionCreateDto>
    {
        public QuizQuestionCreateDtoValidator()
        {
            RuleFor(x => x.QuizId).GreaterThan(0);
            RuleFor(x => x.Text).NotEmpty().MaximumLength(500);
            
            RuleFor(x => x.Type)
                .NotEmpty()
                .Must(t => new[] { "multiple-choice", "true-false", "fill-blank", "short", "long", "multi-select" }.Contains(t))
                .WithMessage("Invalid question type");

            // Validate based on type
            When(x => x.Type == "multiple-choice", () =>
            {
                RuleFor(x => x.Choices).NotEmpty().Must(c => c != null && c.Count >= 2);
                RuleFor(x => x.CorrectAnswerIndex).GreaterThanOrEqualTo(0);
            });

            When(x => x.Type == "multi-select", () =>
            {
                RuleFor(x => x.Choices).NotEmpty().Must(c => c != null && c.Count >= 2);
                RuleFor(x => x.CorrectAnswerIndexes).NotEmpty();
            });

            When(x => x.Type == "true-false", () =>
            {
                RuleFor(x => x.CorrectBool).NotNull();
            });

            When(x => x.Type == "fill-blank" || x.Type == "short" || x.Type == "long", () =>
            {
                RuleFor(x => x.CorrectAnswer).NotEmpty();
            });
        }
    }
}