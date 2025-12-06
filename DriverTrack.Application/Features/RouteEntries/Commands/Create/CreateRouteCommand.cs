using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Commands.Create
{
    public record CreateRouteCommand(
        Guid DriverId,
        Guid VehicleId,
        Guid RouteTypeId,
        DateTime StartDate,
        double StartOdometer
    ) : IRequest<Guid>;
}
