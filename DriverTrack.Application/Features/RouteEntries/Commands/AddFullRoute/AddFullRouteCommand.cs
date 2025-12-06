using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Commands.AddFullRoute
{
    public record AddFullRouteCommand(
        Guid DriverId,
        Guid VehicleId,
        Guid RouteTypeId,
        DateTime StartDate,
        double StartOdometer,
        DateTime EndDate,
        double EndOdometer,
        double? TotalDistance
    ) : IRequest<Guid>;
}
