using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Interfaces
{
    public interface IFuelEntryRepository
    {
        Task<List<FuelEntry>> GetByDriverIdAsync(Guid driverId, DateTime? from = null, DateTime? to = null);
        Task<List<FuelEntry>> GetByVehicleIdAsync(Guid vehicleId, DateTime? from = null, DateTime? to = null);
        Task<FuelEntry?> GetByIdAsync(Guid id);
        Task AddAsync(FuelEntry fuelEntry);
        Task UpdateAsync(FuelEntry fuelEntry);
        Task DeleteAsync(Guid id);
        Task<FuelEntry?> GetPreviousFuelEntryAsync(Guid vehicleId, double currentOdometer);
    }
}
