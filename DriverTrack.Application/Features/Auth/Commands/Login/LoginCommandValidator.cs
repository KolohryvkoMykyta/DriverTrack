using FluentValidation;

namespace DriverTrack.Application.Features.Auth.Commands.Login
{
    public sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
    {
        public LoginCommandValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Необхідно вказати email.")
                .EmailAddress().WithMessage("Некоректний формат email.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Необхідно вказати пароль.")
                .MinimumLength(4).WithMessage("Пароль повинен містити щонайменше 4 символи.");
        }
    }
}