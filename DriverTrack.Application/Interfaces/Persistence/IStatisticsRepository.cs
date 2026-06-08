using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Interfaces.Persistence
{
    public interface IStatisticsRepository
    {
        Task<List<RouteEntry>> GetRoutesForOverviewAsync(
            DateTime? from,
            DateTime? to,
            Guid? driverId,
            Guid? vehicleId,
            CancellationToken cancellationToken = default);

        Task<List<FuelEntry>> GetFuelEntriesForOverviewAsync(
            DateTime? from,
            DateTime? to,
            Guid? driverId,
            Guid? vehicleId,
            CancellationToken cancellationToken = default);
    }
}