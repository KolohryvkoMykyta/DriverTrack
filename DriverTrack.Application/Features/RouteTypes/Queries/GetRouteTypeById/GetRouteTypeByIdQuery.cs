using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.RouteTypes.Queries.GetRouteTypeById
{
    public record GetRouteTypeByIdQuery(Guid Id) : IRequest<RouteTypeDto>;
}
