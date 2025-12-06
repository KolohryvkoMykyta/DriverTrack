using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Commands.UpdateFuelEntry
{
    public record UpdateFuelEntryCommand(
        Guid Id,
        DateTime Date,
        double OdometerReading,
        double Liters,
        bool IsFullTank
    ) : IRequest<Unit>;
}
