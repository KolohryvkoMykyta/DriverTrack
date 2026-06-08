using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Interfaces.Persistence
{
    public interface IFuelEntryRepository
    {
        Task<FuelEntry?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<FuelEntry>> GetByDriverIdAsync(Guid driverId, DateTime? from = null, DateTime? to = null, CancellationToken cancellationToken = default);
        Task<List<FuelEntry>> GetByVehicleIdAsync(Guid vehicleId, DateTime? from = null, DateTime? to = null, CancellationToken cancellationToken = default);
        Task<List<FuelEntry>> GetWithFiltersAsync(DateTime? from = null, DateTime? to = null, CancellationToken cancellationToken = default);
        Task AddAsync(FuelEntry fuelEntry, CancellationToken cancellationToken = default);
        void Update(FuelEntry fuelEntry);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
