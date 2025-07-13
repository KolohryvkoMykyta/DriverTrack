using DriverTrack.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.RouteTypes.Queries.GetAllRouteTypes
{
    public record GetAllRouteTypesQuery() : IRequest<List<RouteTypeDto>>;
}
