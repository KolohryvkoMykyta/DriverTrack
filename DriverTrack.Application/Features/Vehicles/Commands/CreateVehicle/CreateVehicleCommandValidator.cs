using DriverTrack.Application.Common.Constants.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.Vehicles.Commands.CreateVehicle
{
    public sealed class CreateVehicleCommandValidator : AbstractValidator<CreateVehicleCommand>
    {
        public CreateVehicleCommandValidator()
        {
            RuleFor(x => x.DriverId)
                .NotEmpty()
                .WithMessage("DriverId is required.");

            RuleFor(x => x.Brand)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("Brand is required.")
                .MaximumLength(VehicleValidationConstants.BrandMaxLength)
                .WithMessage($"Brand must be at most {VehicleValidationConstants.BrandMaxLength} characters.");

            RuleFor(x => x.Model)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("Model is required.")
                .MaximumLength(VehicleValidationConstants.ModelMaxLength)
                .WithMessage($"Model must be at most {VehicleValidationConstants.ModelMaxLength} characters.");

            RuleFor(x => x.LicensePlate)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("License plate is required.")
                .MaximumLength(VehicleValidationConstants.LicensePlateMaxLength)
                .WithMessage($"License plate must be at most {VehicleValidationConstants.LicensePlateMaxLength} characters.");
        }
    }
}
