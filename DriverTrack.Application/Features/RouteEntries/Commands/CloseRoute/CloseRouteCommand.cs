using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.RouteEntries.Commands.CloseRoute
{
    public record CloseRouteCommand(Guid RouteId, double EndOdometer, DateTime? EndDate) : IRequest<Unit>;
}
