using DriverTrack.Application.Common.Validation;
using FluentValidation;
using DriverTrack.Application.Common.Constants.Validation;

namespace DriverTrack.Application.Features.Drivers.Commands.Update
{
    public sealed class UpdateDriverCommandValidator : AbstractValidator<UpdateDriverCommand>
    {
        public UpdateDriverCommandValidator()
        {
            RuleFor(x => x.Id)
               .NotEmpty()
               .WithMessage("Ідентифікатор водія є обов'язковим.");

            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .RequiredPersonName(DriverValidationConstants.NameMinLength, DriverValidationConstants.NameMaxLength);

            RuleFor(x => x.PhoneNumber)
                .Cascade(CascadeMode.Stop)
                .RequiredPhoneNumber(DriverValidationConstants.PhoneNumberMaxLength, DriverValidationConstants.PhoneDefaultRegion);
        }
    }
}
