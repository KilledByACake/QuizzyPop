using FluentValidation;
using QuizzyPop.Models.Dtos;

namespace QuizzyPop.Validators
{
    public class QuizImageUploadDtoValidator : AbstractValidator<QuizImageUploadDto>
    {
        private readonly string[] allowedTypes = { "image/jpeg", "image/png", "image/webp" };
        private const long maxSize = 5_000_000; // 5 MB

        public QuizImageUploadDtoValidator()
        {
            RuleFor(x => x.Image)
                .NotNull().WithMessage("Image file is required.")
                .Must(file => file != null && allowedTypes.Contains(file.ContentType))
                    .WithMessage("Only JPG, PNG, or WEBP images are allowed.")
                .Must(file => file != null && file.Length <= maxSize)
                    .WithMessage("Image must be smaller than 5 MB.");
        }
    }
}