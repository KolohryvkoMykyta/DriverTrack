using DriverTrack.Application.Common.Constants.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.RouteEntries.Commands.Create
{
    public sealed class CreateRouteCommandValidator : AbstractValidator<CreateRouteCommand>
    {
        public CreateRouteCommandValidator()
        {
            RuleFor(x => x.DriverId)
                .NotEmpty()
                .WithMessage("Ідентифікатор водія є обов'язковим.");

            RuleFor(x => x.VehicleId)
                .NotEmpty()
                .WithMessage("Ідентифікатор автомобіля є обов'язковим.");

            RuleFor(x => x.RouteTypeId)
                .NotEmpty()
                .WithMessage("Ідентифікатор типу маршруту є обов'язковим.");

            RuleFor(x => x.StartDate)
                .NotEmpty()
                .WithMessage("Дата початку є обов'язковою.")
                .Must(d => d <= DateTime.UtcNow)
                .WithMessage("Дата початку не може бути в майбутньому.");

            RuleFor(x => x.StartOdometer)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Показник одометра початку повинен бути >= 0.")
                .LessThanOrEqualTo(VehicleValidationConstants.MaxOdometerReading)
                .WithMessage($"Показник одометра початку повинен бути <= {VehicleValidationConstants.MaxOdometerReading}.");
        }
    }
}
