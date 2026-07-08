using DriverTrack.Application.Common.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.FuelEntries.Queries.GetFuelEntries
{
    public class GetFuelEntriesQueryValidator : AbstractValidator<GetFuelEntriesQuery>
    {
        public GetFuelEntriesQueryValidator()
        {
            RuleFor(x => x)
                .HasValidInterval(x => x.StartDate, x => x.EndDate)
                .WithMessage("Дата початку не може бути пізнішою за дату завершення.");
        }
    }
}
