using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.RouteEntries.Commands.Create
{
    public record CreateRouteCommand(
        Guid DriverId,
        Guid VehicleId,
        Guid RouteTypeId,
        DateTime StartDate,
        double StartOdometer
    ) : IRequest<Guid>;
}
