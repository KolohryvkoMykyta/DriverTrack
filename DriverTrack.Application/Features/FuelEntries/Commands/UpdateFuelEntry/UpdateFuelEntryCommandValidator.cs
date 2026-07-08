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
                .WithMessage("Ідентифікатор запису пального є обов'язковим.");

            RuleFor(x => x.Date)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Дата є обов'язковою.")
                .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Дата не може бути в майбутньому.");

            RuleFor(x => x.OdometerReading)
                .GreaterThanOrEqualTo(0).WithMessage("Показник одометра повинен бути >= 0.")
                .LessThanOrEqualTo(VehicleValidationConstants.MaxOdometerReading).WithMessage($"Показник одометра повинен бути <= {VehicleValidationConstants.MaxOdometerReading}.");

            RuleFor(x => x.Liters)
                .GreaterThan(0).WithMessage("Кількість літрів повинна бути > 0.")
                .LessThanOrEqualTo(FuelEntryValidationConstants.MaxLiters).WithMessage($"Кількість літрів повинна бути   <= {FuelEntryValidationConstants.MaxLiters}.");
        }
    }
}
