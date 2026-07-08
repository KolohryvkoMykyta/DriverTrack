using DriverTrack.Application.Common.Constants.Validation;
using DriverTrack.Application.Common.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.RouteEntries.Commands.UpdateRoute
{
    public sealed class UpdateRouteCommandValidator : AbstractValidator<UpdateRouteCommand>
    {
        public UpdateRouteCommandValidator()
        {
            RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Ідентифікатор маршруту є обов'язковим.");

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

            RuleFor(x => x.EndDate)
                .Must(d => d == null || d.Value <= DateTime.UtcNow)
                .WithMessage("Дата завершення не може бути в майбутньому.");

            RuleFor(x => x)
                .HasValidInterval(x => x.StartDate, x => x.EndDate)
                .WithMessage("Дата початку повинна бути менше або дорівнювати даті завершення.");

            RuleFor(x => x)
                .Must(x => x.EndDate.HasValue == x.EndOdometer.HasValue)
                .WithMessage("Дата завершення та показник одометра завершення повинні бути вказані разом.");

            RuleFor(x => x.StartOdometer)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Показник одометра початку повинен бути >= 0.")
                .LessThanOrEqualTo(VehicleValidationConstants.MaxOdometerReading)
                .WithMessage($"Показник одометра початку повинен бути <= {VehicleValidationConstants.MaxOdometerReading}.");

            When(x => x.EndOdometer.HasValue, () =>
            {
                RuleFor(x => x.EndOdometer!.Value)
                    .GreaterThanOrEqualTo(0)
                    .WithMessage("Показник одометра завершення повинен бути >= 0.")
                    .LessThanOrEqualTo(VehicleValidationConstants.MaxOdometerReading)
                    .WithMessage($"Показник одометра завершення повинен бути <= {VehicleValidationConstants.MaxOdometerReading}.");
            });

            RuleFor(x => x)
                .HasValidInterval(x => x.StartOdometer, x => x.EndOdometer)
                .WithMessage("Показник одометра початку повинен бути менше або дорівнювати показнику одометра завершення.");
        }
    }
}
