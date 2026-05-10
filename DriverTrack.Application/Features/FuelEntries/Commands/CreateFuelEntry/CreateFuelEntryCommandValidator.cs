using FluentValidation;
using DriverTrack.Application.Common.Constants.Validation;

namespace DriverTrack.Application.Features.FuelEntries.Commands.CreateFuelEntry
{
    public sealed class CreateFuelEntryCommandValidator : AbstractValidator<CreateFuelEntryCommand>
    {
        public CreateFuelEntryCommandValidator()
        {
            RuleFor(x => x.DriverId)
                .NotEmpty().WithMessage("Driver id is required.");

            RuleFor(x => x.VehicleId)
                .NotEmpty().WithMessage("Vehicle id is required.");

            RuleFor(x => x.Date)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Date is required.")
                .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Date cannot be in the future.");

            RuleFor(x => x.OdometerReading)
                .GreaterThanOrEqualTo(0).WithMessage("Odometer reading must be >= 0.")
                .LessThanOrEqualTo(VehicleValidationConstants.MaxOdometerReading).WithMessage($"Odometer reading must be <= {VehicleValidationConstants.MaxOdometerReading}.");

            RuleFor(x => x.Liters)
                .GreaterThan(0).WithMessage("Liters must be > 0.")
                .LessThanOrEqualTo(FuelEntryValidationConstants.MaxLiters).WithMessage($"Liters must be <= {FuelEntryValidationConstants.MaxLiters}.");
        }
    }
}
