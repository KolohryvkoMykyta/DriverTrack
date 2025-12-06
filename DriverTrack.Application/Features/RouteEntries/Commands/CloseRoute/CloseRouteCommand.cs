using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Commands.CloseRoute
{
    public record CloseRouteCommand(Guid RouteId, double EndOdometer, DateTime? EndDate) : IRequest<Unit>;
}
