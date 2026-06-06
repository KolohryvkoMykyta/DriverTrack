using DriverTrack.Application.Common.Constants.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.RouteTypes.Commands.CreateRouteType
{
    public sealed class CreateRouteTypeCommandValidator : AbstractValidator<CreateRouteTypeCommand>
    {
        public CreateRouteTypeCommandValidator()
        {
            RuleFor(x => x.DriverPayment)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Оплата водію має бути більшою або дорівнювати 0.")
                .LessThanOrEqualTo(RouteTypeValidationConstants.MaxDriverPayment)
                .WithMessage($"Оплата водію має бути не більше {RouteTypeValidationConstants.MaxDriverPayment}.");

            RuleFor(x => x.Revenue)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Дохід має бути більшим або дорівнювати 0.")
                .LessThanOrEqualTo(RouteTypeValidationConstants.MaxRevenue)
                .WithMessage($"Дохід має бути не більше {RouteTypeValidationConstants.MaxRevenue}.");
        }
    }
}
