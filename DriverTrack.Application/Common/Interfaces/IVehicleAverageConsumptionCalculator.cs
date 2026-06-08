namespace DriverTrack.Application.Common.Interfaces
{
    public interface IVehicleAverageConsumptionCalculator
    {
        Task<double?> CalculateAsync(Guid vehicleId, CancellationToken ct);
    }
}
