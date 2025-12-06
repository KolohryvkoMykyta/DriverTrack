using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Queries.GetRoutesByDriver
{
    public record GetRoutesByDriverQuery(
        Guid DriverId,
        DateTime? From,
        DateTime? To
    ) : IRequest<List<RouteEntryDto>>;
}
