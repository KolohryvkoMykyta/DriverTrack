using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.Vehicles.Commands.UpdateVehicle
{
    public record UpdateVehicleCommand(
        Guid Id,
        string Brand,
        string Model,
        string LicensePlate,
        bool IsActive
    ) : IRequest<Unit>;
}
