using FluentValidation;

namespace DriverTrack.Application.Features.RouteTypes.Commands.DeleteRouteType
{
    public sealed class DeleteRouteTypeCommandValidator : AbstractValidator<DeleteRouteTypeCommand>
    {
        public DeleteRouteTypeCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Ідентифікатор типу маршруту є обов'язковим.");
        }
    }
}
