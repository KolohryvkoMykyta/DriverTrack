using MediatR;

namespace DriverTrack.Application.Features.RouteTypes.Commands.CreateRouteType
{
    public record CreateRouteTypeCommand(
        string Name,
        decimal DriverPayment,
        decimal Revenue
    ) : IRequest<Guid>;
}
