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

            RuleFor(x => x.StartOdometer)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Start odometer must be greater than or equal to 0.")
                .LessThanOrEqualTo(VehicleValidationConstants.MaxOdometerReading)
                .WithMessage($"Start odometer must be less than or equal to {VehicleValidationConstants.MaxOdometerReading}.");
        }
    }
}
