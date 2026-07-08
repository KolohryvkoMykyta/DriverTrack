using DriverTrack.Application.Common.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.RouteEntries.Queries.GetRoutesByDriver
{
    public sealed class GetRoutesQueryValidator : AbstractValidator<GetRoutesQuery>
    {
        public GetRoutesQueryValidator()
        {
            RuleFor(x => x)
                .HasValidInterval(x => x.FromDate, x => x.ToDate)
                .WithMessage("Дата початку не може бути пізніше дати завершення");
        }
    }
}
