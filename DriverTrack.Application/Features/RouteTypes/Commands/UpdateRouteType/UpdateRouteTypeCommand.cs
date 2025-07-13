using MediatR;

namespace DriverTrack.Application.Features.RouteTypes.Commands.UpdateRouteType
{
    public record UpdateRouteTypeCommand(
        Guid Id,
        string Name,
        decimal Earnings
    ) : IRequest<Unit>;
}
