using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Commands.DeleteRoute
{
    public record DeleteRouteCommand(Guid Id) : IRequest<Unit>;
}
