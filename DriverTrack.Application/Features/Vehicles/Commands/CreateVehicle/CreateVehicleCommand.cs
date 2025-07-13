using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.Vehicles.Commands.CreateVehicle
{
    public record CreateVehicleCommand(
        Guid DriverId,
        string Brand,
        string Model,
        string LicensePlate
    ) : IRequest<Guid>;
}
