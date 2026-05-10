using DriverTrack.Application.Common.Validation;
using FluentValidation;
using DriverTrack.Application.Common.Constants.Validation;

namespace DriverTrack.Application.Features.Drivers.Commands.Create
{
    public sealed class CreateDriverCommandValidator : AbstractValidator<CreateDriverCommand>
    {
        public CreateDriverCommandValidator()
        {
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .RequiredPersonName(DriverValidationConstants.NameMinLength, DriverValidationConstants.NameMaxLength);

            RuleFor(x => x.PhoneNumber)
                .Cascade(CascadeMode.Stop)
                .RequiredPhoneNumber(DriverValidationConstants.PhoneNumberMaxLength, DriverValidationConstants.PhoneDefaultRegion);
        }
    }
}
