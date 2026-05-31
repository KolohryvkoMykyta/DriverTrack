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
                .EmailAddress();

            RuleFor(x => x.Password)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .MinimumLength(4);
        }
    }
}