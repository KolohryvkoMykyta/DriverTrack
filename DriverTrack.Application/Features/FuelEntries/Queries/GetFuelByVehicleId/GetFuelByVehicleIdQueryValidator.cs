using DriverTrack.Application.Common.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.FuelEntries.Queries.GetFuelByVehicleId
{
    public sealed class GetFuelByVehicleIdQueryValidator : AbstractValidator<GetFuelByVehicleIdQuery>
    {
        public GetFuelByVehicleIdQueryValidator() 
        {
            RuleFor(x => x.VehicleId)
                .NotEmpty()
                .WithMessage("Vehicle id is required.");

            RuleFor(x => x)
                .HasValidInterval(x => x.From, x => x.To)
                .WithMessage("From date must be less than or equal to To date.");
        }
    }
}
