using DriverTrack.Application.Common.Constants.Validation;
using DriverTrack.Application.Common.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.Auth.Commands.RegisterAdmin
{
    public sealed class RegisterAdminCommandValidator : AbstractValidator<RegisterAdminCommand>
    {
        public RegisterAdminCommandValidator()
        {
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .RequiredPersonName(
                    DriverValidationConstants.NameMinLength,
                    DriverValidationConstants.NameMaxLength);

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Необхідно вказати email.")
                .EmailAddress().WithMessage("Некоректний формат email.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Необхідно вказати пароль.")
                .MinimumLength(4).WithMessage("Пароль повинен містити щонайменше 4 символи.");
        }
    }
}