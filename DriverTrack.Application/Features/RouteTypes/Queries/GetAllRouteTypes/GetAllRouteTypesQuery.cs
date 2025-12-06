using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.RouteTypes.Queries.GetAllRouteTypes
{
    public record GetAllRouteTypesQuery() : IRequest<List<RouteTypeDto>>;
}
