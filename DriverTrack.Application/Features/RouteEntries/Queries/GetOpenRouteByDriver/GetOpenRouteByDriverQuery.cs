using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Queries.GetOpenRouteByDriver
{
    public record GetOpenRouteByDriverQuery(Guid DriverId) : IRequest<RouteEntryDto?>;
}
