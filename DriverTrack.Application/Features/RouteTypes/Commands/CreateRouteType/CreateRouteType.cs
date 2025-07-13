using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.RouteTypes.Commands.CreateRouteType
{
    public record CreateRouteTypeCommand(
        string Name,
        decimal Earnings
    ) : IRequest<Guid>;
}
