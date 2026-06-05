using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Queries.GetRoutesByDriver
{
    public record GetRoutesQuery(
        Guid? DriverId,
        DateTime? FromDate,
        DateTime? ToDate
    ) : IRequest<List<RouteEntryDto>>;
}
