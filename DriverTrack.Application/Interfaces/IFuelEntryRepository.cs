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
        Task<FuelEntry?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<FuelEntry>> GetByDriverIdAsync(Guid driverId, DateTime? from = null, DateTime? to = null, CancellationToken cancellationToken = default);
        Task<List<FuelEntry>> GetByVehicleIdAsync(Guid vehicleId, DateTime? from = null, DateTime? to = null, CancellationToken cancellationToken = default);
        Task AddAsync(FuelEntry fuelEntry, CancellationToken cancellationToken = default);
        void Update(FuelEntry fuelEntry);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
