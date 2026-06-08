namespace DriverTrack.Application.Common.Interfaces
{
    public interface IFuelConsumptionCalculator
    {
        Task<(double? Distance, double? Consumption)> CalculateAsync(
            Guid vehicleId,
            double odometer,
            double liters,
            CancellationToken ct);
    }
}