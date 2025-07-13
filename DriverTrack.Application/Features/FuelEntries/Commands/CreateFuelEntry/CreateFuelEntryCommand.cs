using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Commands.CreateFuelEntry
{
    public record CreateFuelEntryCommand(
        Guid DriverId,
        Guid VehicleId,
        DateTime Date,
        double OdometerReading,
        double Liters
    ) : IRequest<Guid>;
}
