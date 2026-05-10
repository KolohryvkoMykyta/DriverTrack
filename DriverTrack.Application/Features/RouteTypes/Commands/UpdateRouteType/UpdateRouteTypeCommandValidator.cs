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
                .WithMessage("Route type id is required.");

            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("Name is required.")
                .MinimumLength(RouteTypeValidationConstants.NameMinLength)
                .WithMessage($"Name must be at least {RouteTypeValidationConstants.NameMinLength} characters.")
                .MaximumLength(RouteTypeValidationConstants.NameMaxLength)
                .WithMessage($"Name must be at most {RouteTypeValidationConstants.NameMaxLength} characters.");

            RuleFor(x => x.Earnings)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Earnings must be greater than or equal to 0.")
                .LessThanOrEqualTo(RouteTypeValidationConstants.MaxEarnings)
                .WithMessage($"Earnings must be less than or equal to {RouteTypeValidationConstants.MaxEarnings}.");
        }
    }
}
