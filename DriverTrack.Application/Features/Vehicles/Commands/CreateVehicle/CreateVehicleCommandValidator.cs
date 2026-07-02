using DriverTrack.Application.Common.Constants.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.Vehicles.Commands.CreateVehicle
{
    public sealed class CreateVehicleCommandValidator : AbstractValidator<CreateVehicleCommand>
    {
        public CreateVehicleCommandValidator()
        {
            RuleFor(x => x.Brand)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("Марка автомобіля є обов'язковою.")
                .MaximumLength(VehicleValidationConstants.BrandMaxLength)
                .WithMessage($"Марка автомобіля не може перевищувати {VehicleValidationConstants.BrandMaxLength} символів.");

            RuleFor(x => x.Model)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("Модель автомобіля є обов'язковою.")
                .MaximumLength(VehicleValidationConstants.ModelMaxLength)
                .WithMessage($"Модель автомобіля не може перевищувати {VehicleValidationConstants.ModelMaxLength} символів.");

            RuleFor(x => x.LicensePlate)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("Державний номер є обов'язковим.")
                .MaximumLength(VehicleValidationConstants.LicensePlateMaxLength)
                .WithMessage($"Державний номер не може перевищувати {VehicleValidationConstants.LicensePlateMaxLength} символів.");
        }
    }
}
