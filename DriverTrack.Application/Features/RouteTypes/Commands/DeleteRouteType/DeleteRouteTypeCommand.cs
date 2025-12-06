using MediatR;

namespace DriverTrack.Application.Features.RouteTypes.Commands.DeleteRouteType
{
    public record DeleteRouteTypeCommand(Guid Id) : IRequest<Unit>;
}
