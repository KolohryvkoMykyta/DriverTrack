using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Queries.GetRouteById
{
    public record GetRouteByIdQuery(Guid Id) : IRequest<RouteEntryDto>;
}
