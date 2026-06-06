using MediatR;

namespace DriverTrack.Application.Features.RouteTypes.Commands.UpdateRouteType
{
    public record UpdateRouteTypeCommand(
        Guid Id,
        string Name,
        decimal DriverPayment,
        decimal Revenue
    ) : IRequest<Unit>;
}
