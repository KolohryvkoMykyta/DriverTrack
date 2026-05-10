using DriverTrack.Application.Common.Constants.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.FuelEntries.Commands.UpdateFuelEntry
{
    public sealed class UpdateFuelEntryCommandValidator : AbstractValidator<UpdateFuelEntryCommand>
    {
        public UpdateFuelEntryCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Fuel entry id is required.");

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
