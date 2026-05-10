using MediatR;

namespace DriverTrack.Application.Features.RouteTypes.Commands.CreateRouteType
{
    public record CreateRouteTypeCommand(
        string Name,
        decimal Earnings
    ) : IRequest<Guid>;
}
