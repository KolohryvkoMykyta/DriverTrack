using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Interfaces.Persistence
{
    public interface IFuelEntryRepository
    {
        Task<FuelEntry?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<FuelEntry>> GetWithFiltersAsync(Guid? driverId = null, Guid? vehicleId = null, DateTime? from = null, DateTime? to = null, CancellationToken cancellationToken = default);
        Task AddAsync(FuelEntry fuelEntry, CancellationToken cancellationToken = default);
        void Update(FuelEntry fuelEntry);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<FuelEntry>> GetTrackedByVehicleIdAsync(Guid vehicleId, CancellationToken cancellationToken = default);
    }
}
