using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Common.Interfaces
{
    public interface IFuelCostCalculator
    {
        Task<decimal> CalculateAsync(IEnumerable<FuelEntry> fuelEntries, CancellationToken cancellationToken = default);

        Task<decimal?> CalculateAsync(double liters, DateTime date, CancellationToken cancellationToken = default);
    }
}