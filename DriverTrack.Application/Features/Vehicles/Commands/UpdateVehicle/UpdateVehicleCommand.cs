using MediatR;

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
