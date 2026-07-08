namespace DriverTrack.Application.Common.Interfaces
{
    public interface IFuelEntriesRecalculationService
    {
        Task RecalculateForVehicleAsync(Guid vehicleId, CancellationToken ct);
    }
}