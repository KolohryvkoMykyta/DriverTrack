using DriverTrack.Application.Common.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.FuelEntries.Queries.GetFuelByDriverId
{
    public sealed class GetFuelByDriverIdQueryValidator : AbstractValidator<GetFuelByDriverIdQuery>
    {
        public GetFuelByDriverIdQueryValidator()
        {
            RuleFor(x => x.DriverId)
                .NotEmpty()
                .WithMessage("Driver id is required.");

            RuleFor(x => x)
                .HasValidInterval(x => x.From, x => x.To)
                .WithMessage("From date must be less than or equal to To date.");
        }
    }
}
