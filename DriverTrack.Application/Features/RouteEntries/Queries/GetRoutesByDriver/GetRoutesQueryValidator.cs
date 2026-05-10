using DriverTrack.Application.Common.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.RouteEntries.Queries.GetRoutesByDriver
{
    public sealed class GetRoutesQueryValidator : AbstractValidator<GetRoutesQuery>
    {
        public GetRoutesQueryValidator()
        {
            RuleFor(x => x.DriverId)
                .NotEmpty()
                .WithMessage("Driver id is required.");

            RuleFor(x => x)
                .HasValidInterval(x => x.FromDate, x => x.ToDate)
                .WithMessage("From date must be less than or equal to To date.");
        }
    }
}
