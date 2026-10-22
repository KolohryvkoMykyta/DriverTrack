using DriverTrack.Application.Common.Constants.ErrorMessages;
using FluentValidation;

namespace DriverTrack.Application.Features.Statistics.Queries.GetDriverDashboard;

public sealed class GetDriverDashboardQueryValidator
    : AbstractValidator<GetDriverDashboardQuery>
{
    public GetDriverDashboardQueryValidator()
    {
        RuleFor(query => query.From)
            .Must(date =>
                date != default &&
                date.Kind == DateTimeKind.Utc)
            .WithMessage(
                ErrorMessages.Filters.UtcPeriodRequired.Message);

        RuleFor(query => query.To)
            .Must(date =>
                date != default &&
                date.Kind == DateTimeKind.Utc)
            .WithMessage(
                ErrorMessages.Filters.UtcPeriodRequired.Message);

        RuleFor(query => query.To)
            .GreaterThan(query => query.From)
            .WithMessage(
                ErrorMessages.Filters.InvalidPeriod.Message);
    }
}