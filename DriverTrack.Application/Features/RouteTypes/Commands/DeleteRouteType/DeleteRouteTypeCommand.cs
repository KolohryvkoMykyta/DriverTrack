using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.RouteTypes.Commands.DeleteRouteType
{
    public record DeleteRouteTypeCommand(Guid Id) : IRequest<Unit>;
}
