using FluentValidation;
using DriverTrack.Application.Common.Constants.Validation;

namespace DriverTrack.Application.Features.FuelEntries.Commands.CreateFuelEntry
{
    public sealed class CreateFuelEntryCommandValidator : AbstractValidator<CreateFuelEntryCommand>
    {
        public CreateFuelEntryCommandValidator()
        {
            RuleFor(x => x.DriverId)
                .NotEmpty().WithMessage("Ідентифікатор водія є обов'язковим.");

            RuleFor(x => x.VehicleId)
                .NotEmpty().WithMessage("Ідентифікатор автомобіля є обов'язковим.");

            RuleFor(x => x.Date)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Дата є обов'язковою.")
                .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Дата не може бути в майбутньому.");

            RuleFor(x => x.OdometerReading)
                .GreaterThanOrEqualTo(0).WithMessage("Показник одометра повинен бути >= 0.")
                .LessThanOrEqualTo(VehicleValidationConstants.MaxOdometerReading).WithMessage($"Показник одометра повинен бути <= {VehicleValidationConstants.MaxOdometerReading}.");

            RuleFor(x => x.Liters)
                .GreaterThan(0).WithMessage("Кількість літрів повинна бути > 0.")
                .LessThanOrEqualTo(FuelEntryValidationConstants.MaxLiters).WithMessage($"Кількість літрів повинна бути <= {FuelEntryValidationConstants.MaxLiters}.");
        }
    }
}
