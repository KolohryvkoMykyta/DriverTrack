using DriverTrack.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.RouteEntries.Queries.GetRoutesByDriver
{
    public record GetRoutesByDriverQuery(
        Guid DriverId,
        DateTime? From,
        DateTime? To
    ) : IRequest<List<RouteEntryDto>>;
}
