using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.RouteEntries.Commands.DeleteRoute
{
    public record DeleteRouteCommand(Guid Id) : IRequest<Unit>;
}
