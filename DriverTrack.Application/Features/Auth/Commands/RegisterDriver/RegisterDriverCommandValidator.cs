using DriverTrack.Application.Common.Constants.Validation;
using DriverTrack.Application.Common.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.Auth.Commands.RegisterDriver
{
    public sealed class RegisterDriverCommandValidator
        : AbstractValidator<RegisterDriverCommand>
    {
        public RegisterDriverCommandValidator()
        {
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .RequiredPersonName(
                    DriverValidationConstants.NameMinLength,
                    DriverValidationConstants.NameMaxLength);

            RuleFor(x => x.PhoneNumber)
                .Cascade(CascadeMode.Stop)
                .RequiredPhoneNumber(
                    DriverValidationConstants.PhoneNumberMaxLength,
                    DriverValidationConstants.PhoneDefaultRegion);

            RuleFor(x => x.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("Email є обов'язковим.")
                .EmailAddress()
                .WithMessage("Email має некоректний формат.");

            RuleFor(x => x.Password)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("Пароль є обов'язковим.")
                .MinimumLength(4)
                .WithMessage("Пароль має містити щонайменше 4 символи.");
        }
    }
}