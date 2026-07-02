using DriverTrack.Application.Common.Constants.Validation;
using DriverTrack.Application.Common.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.RouteEntries.Commands.AddFullRoute
{
    public sealed class AddFullRouteCommandValidator : AbstractValidator<AddFullRouteCommand>
    {
        public AddFullRouteCommandValidator()
        {
            RuleFor(x => x.DriverId)
                .NotEmpty()
                .WithMessage("Оберіть водія.");

            RuleFor(x => x.VehicleId)
                .NotEmpty()
                .WithMessage("Оберіть автомобіль.");

            RuleFor(x => x.RouteTypeId)
                .NotEmpty()
                .WithMessage("Оберіть тип маршруту.");

            RuleFor(x => x.StartDate)
                .NotEmpty()
                .WithMessage("Вкажіть дату початку.")
                .Must(d => d <= DateTime.UtcNow)
                .WithMessage("Дата початку не може бути в майбутньому.");

            RuleFor(x => x.EndDate)
                .NotEmpty()
                .WithMessage("Вкажіть дату завершення.")
                .Must(d => d <= DateTime.UtcNow)
                .WithMessage("Дата завершення не може бути в майбутньому.");

            RuleFor(x => x.StartOdometer)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Початковий одометр має бути більшим або дорівнювати 0.")
                .LessThanOrEqualTo(VehicleValidationConstants.MaxOdometerReading)
                .WithMessage($"Початковий одометр має бути не більше {VehicleValidationConstants.MaxOdometerReading}.");

            RuleFor(x => x.EndOdometer)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Кінцевий одометр має бути більшим або дорівнювати 0.")
                .LessThanOrEqualTo(VehicleValidationConstants.MaxOdometerReading)
                .WithMessage($"Кінцевий одометр має бути не більше {VehicleValidationConstants.MaxOdometerReading}.");

            RuleFor(x => x)
                .HasValidInterval(x => x.StartDate, x => x.EndDate)
                .WithMessage("Дата завершення має бути пізніше або дорівнювати даті початку.");

            RuleFor(x => x)
                .HasValidInterval(x => x.StartOdometer, x => x.EndOdometer)
                .WithMessage("Кінцевий одометр має бути більшим або дорівнювати початковому.");

            When(x => x.TotalDistance.HasValue, () =>
            {
                RuleFor(x => x.TotalDistance!.Value)
                    .GreaterThanOrEqualTo(0)
                    .WithMessage("Загальна відстань має бути більшою або дорівнювати 0.");
            });
        }
    }
}
