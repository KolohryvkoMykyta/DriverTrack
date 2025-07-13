using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        decimal? Earnings
    ) : IRequest<Unit>;
}
