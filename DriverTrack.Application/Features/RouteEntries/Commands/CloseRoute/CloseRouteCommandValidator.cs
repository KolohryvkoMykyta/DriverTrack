using DriverTrack.Application.Common.Constants.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.RouteEntries.Commands.CloseRoute
{
    public sealed class CloseRouteCommandValidator : AbstractValidator<CloseRouteCommand>
    {
        public CloseRouteCommandValidator()
        {
            RuleFor(x => x.RouteId)
                .NotEmpty()
                .WithMessage("Ідентифікатор маршруту є обов'язковим.");

            RuleFor(x => x.EndOdometer)
                .Cascade(CascadeMode.Stop)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Показник одометра завершення повинен бути >= 0.")
                .LessThanOrEqualTo(VehicleValidationConstants.MaxOdometerReading)
                .WithMessage($"Показник одометра завершення повинен бути <= {VehicleValidationConstants.MaxOdometerReading}.");

            RuleFor(x => x.EndDate)
                .Must(d => d == null || d.Value <= DateTime.UtcNow)
                .WithMessage("Дата завершення не може бути в майбутньому.");
        }
    }
}
