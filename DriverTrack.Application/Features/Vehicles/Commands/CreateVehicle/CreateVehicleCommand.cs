using MediatR;

namespace DriverTrack.Application.Features.Vehicles.Commands.CreateVehicle
{
    public record CreateVehicleCommand(
        Guid? DriverId,
        string Brand,
        string Model,
        string LicensePlate
    ) : IRequest<Guid>;
}
