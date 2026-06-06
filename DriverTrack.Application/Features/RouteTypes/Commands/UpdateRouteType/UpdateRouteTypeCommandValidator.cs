using DriverTrack.Application.Common.Constants.Validation;
using FluentValidation;

namespace DriverTrack.Application.Features.RouteTypes.Commands.UpdateRouteType
{
    public sealed class UpdateRouteTypeCommandValidator : AbstractValidator<UpdateRouteTypeCommand>
    {
        public UpdateRouteTypeCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Необхідно обрати тип маршруту.");

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
