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
            .WithMessage("Route id is required.");

            RuleFor(x => x.VehicleId)
                .NotEmpty()
                .WithMessage("Vehicle id is required.");

            RuleFor(x => x.RouteTypeId)
                .NotEmpty()
                .WithMessage("Route type id is required.");

            RuleFor(x => x.StartDate)
                .NotEmpty()
                .WithMessage("Start date is required.")
                .Must(d => d <= DateTime.UtcNow)
                .WithMessage("Start date cannot be in the future.");

            RuleFor(x => x.EndDate)
                .Must(d => d == null || d.Value <= DateTime.UtcNow)
                .WithMessage("End date cannot be in the future.");

            RuleFor(x => x)
                .HasValidInterval(x => x.StartDate, x => x.EndDate)
                .WithMessage("Start date must be less than or equal to End date.");

            RuleFor(x => x)
                .Must(x => x.EndDate.HasValue == x.EndOdometer.HasValue)
                .WithMessage("End date and end odometer must be provided together.");

            RuleFor(x => x.StartOdometer)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Start odometer must be greater than or equal to 0.")
                .LessThanOrEqualTo(VehicleValidationConstants.MaxOdometerReading)
                .WithMessage($"Start odometer must be less than or equal to {VehicleValidationConstants.MaxOdometerReading}.");

            When(x => x.EndOdometer.HasValue, () =>
            {
                RuleFor(x => x.EndOdometer!.Value)
                    .GreaterThanOrEqualTo(0)
                    .WithMessage("End odometer must be greater than or equal to 0.")
                    .LessThanOrEqualTo(VehicleValidationConstants.MaxOdometerReading)
                    .WithMessage($"End odometer must be less than or equal to {VehicleValidationConstants.MaxOdometerReading}.");
            });

            RuleFor(x => x)
                .HasValidInterval(x => x.StartOdometer, x => x.EndOdometer)
                .WithMessage("Start odometer must be less than or equal to End odometer.");
        }
    }
}
