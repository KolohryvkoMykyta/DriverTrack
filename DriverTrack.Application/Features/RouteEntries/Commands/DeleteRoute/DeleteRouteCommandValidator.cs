using FluentValidation;

namespace DriverTrack.Application.Features.RouteEntries.Commands.DeleteRoute
{
    public sealed class DeleteRouteCommandValidator : AbstractValidator<DeleteRouteCommand>
    {
        public DeleteRouteCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Ідентифікатор запису маршруту є обов'язковим.");
        }
    }
}
