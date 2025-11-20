using FluentValidation;
using QuizzyPop.Models.Dtos;

namespace QuizzyPop.Validators
{
    public class LoginRequestValidator : AbstractValidator<LoginRequest>
    {
        public LoginRequestValidator()
        {
            RuleFor(l => l.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(l => l.Password)
                .NotEmpty().WithMessage("Password is required");
        }
    }
}
