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
                .WithMessage("Driver id is required.");

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
                .NotEmpty()
                .WithMessage("End date is required.")
                .Must(d => d <= DateTime.UtcNow)
                .WithMessage("End date cannot be in the future.");

            RuleFor(x => x.StartOdometer)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Start odometer must be greater than or equal to 0.")
                .LessThanOrEqualTo(VehicleValidationConstants.MaxOdometerReading)
                .WithMessage($"Start odometer must be less than or equal to {VehicleValidationConstants.MaxOdometerReading}.");

            RuleFor(x => x.EndOdometer)
                .GreaterThanOrEqualTo(0)
                .WithMessage("End odometer must be greater than or equal to 0.")
                .LessThanOrEqualTo(VehicleValidationConstants.MaxOdometerReading)
                .WithMessage($"End odometer must be less than or equal to {VehicleValidationConstants.MaxOdometerReading}.");

            RuleFor(x => x)
                .HasValidInterval(x => x.StartDate, x => x.EndDate)
                .WithMessage("Start date must be less than or equal to End date.");

            RuleFor(x => x)
                .HasValidInterval(x => x.StartOdometer, x => x.EndOdometer)
                .WithMessage("Start odometer must be less than or equal to End odometer.");

            When(x => x.TotalDistance.HasValue, () =>
            {
                RuleFor(x => x.TotalDistance!.Value)
                    .GreaterThanOrEqualTo(0)
                    .WithMessage("Total distance must be greater than or equal to 0.");
            });
        }
    }
}
