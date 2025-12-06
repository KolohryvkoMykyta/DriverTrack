using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Commands.UpdateRoute
{
    public record UpdateRouteCommand(
        Guid Id,
        Guid VehicleId,
        Guid RouteTypeId,
        DateTime StartDate,
        double StartOdometer,
        DateTime? EndDate,
        double? EndOdometer,
        double? TotalDistance, 
        decimal? Earnings
    ) : IRequest<Unit>;
}
