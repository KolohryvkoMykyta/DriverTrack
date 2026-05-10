using FluentValidation;

namespace DriverTrack.Application.Features.RouteEntries.Commands.DeleteRoute
{
    public sealed class DeleteRouteCommandValidator : AbstractValidator<DeleteRouteCommand>
    {
        public DeleteRouteCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Route entry id is required.");
        }
    }
}
