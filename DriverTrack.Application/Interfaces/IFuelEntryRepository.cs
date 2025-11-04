using DriverTrack.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Interfaces
{
    public interface IFuelEntryRepository
    {
        Task<FuelEntry?> GetByIdAsync(Guid id);
        Task<List<FuelEntry>> GetByDriverIdAsync(Guid driverId, DateTime? from = null, DateTime? to = null);
        Task<List<FuelEntry>> GetByVehicleIdAsync(Guid vehicleId, DateTime? from = null, DateTime? to = null);
        Task AddAsync(FuelEntry fuelEntry);
        Task UpdateAsync(FuelEntry fuelEntry);
        Task DeleteAsync(Guid id);
        Task<FuelEntry?> GetPreviousFuelEntryAsync(Guid vehicleId, double currentOdometer);
    }
}
