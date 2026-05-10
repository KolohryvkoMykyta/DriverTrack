using MediatR;

namespace DriverTrack.Application.Features.Vehicles.Commands.DeleteVehicle
{
    public record DeleteVehicleCommand(Guid Id) : IRequest<Unit>;
}
