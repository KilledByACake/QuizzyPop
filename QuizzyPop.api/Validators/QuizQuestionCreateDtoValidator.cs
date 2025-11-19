using FluentValidation;
using QuizzyPop.Models.Dtos;

namespace QuizzyPop.Validators
{
    public class QuizQuestionCreateDtoValidator : AbstractValidator<QuizQuestionCreateDto>
    {
        public QuizQuestionCreateDtoValidator()
        {
            RuleFor(q => q.Text)
                .NotEmpty().WithMessage("Question text is required")
                .MinimumLength(5).WithMessage("Question must be at least 5 characters");

            RuleFor(q => q.Choices)
                .NotNull().WithMessage("Choices are required")
                .Must(c => c.Count >= 2).WithMessage("There must be at least 2 choices");

            RuleFor(q => q.CorrectAnswerIndex)
                .InclusiveBetween(0, int.MaxValue)
                .WithMessage("CorrectAnswerIndex must be a valid index in Choices")
                .Must((dto, index) => dto.Choices != null && index < dto.Choices.Count)
                .WithMessage("CorrectAnswerIndex must match one of the choices");
        }
    }
}