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
                .WithMessage("Route id is required.");

            RuleFor(x => x.EndOdometer)
                .Cascade(CascadeMode.Stop)
                .GreaterThanOrEqualTo(0)
                .WithMessage("End odometer must be greater than or equal to 0.")
                .LessThanOrEqualTo(VehicleValidationConstants.MaxOdometerReading)
                .WithMessage($"End odometer must be less than or equal to {VehicleValidationConstants.MaxOdometerReading}.");

            RuleFor(x => x.EndDate)
                .Must(d => d == null || d.Value <= DateTime.UtcNow)
                .WithMessage("End date cannot be in the future.");
        }
    }
}
