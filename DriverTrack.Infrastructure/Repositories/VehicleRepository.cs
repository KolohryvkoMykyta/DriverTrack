using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using DriverTrack.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DriverTrack.Infrastructure.Repositories
{
    public sealed class VehicleRepository : IVehicleRepository
    {
        private readonly DriverTrackDbContext _dbContext;

        public VehicleRepository(DriverTrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<Vehicle?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return _dbContext.Vehicles
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.Id == id, cancellationToken);
        }

        public Task<List<Vehicle>> GetByDriverIdAsync(Guid driverId, CancellationToken cancellationToken = default)
        {
            return _dbContext.Vehicles
                .AsNoTracking()
                .Where(v => v.DriverId == driverId)
                .OrderBy(v => v.Brand)
                .ThenBy(v => v.Model)
                .ThenBy(v => v.LicensePlate)
                .ToListAsync(cancellationToken);
        }

        public Task<List<Vehicle>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return _dbContext.Vehicles
                .AsNoTracking()
                .OrderBy(v => v.Brand)
                .ThenBy(v => v.Model)
                .ThenBy(v => v.LicensePlate)
                .ToListAsync(cancellationToken);
        }

        public async Task AddAsync(Vehicle vehicle, CancellationToken cancellationToken = default)
        {
            await _dbContext.Vehicles.AddAsync(vehicle, cancellationToken);
        }

        public void Update(Vehicle vehicle)
        {
            _dbContext.Vehicles.Update(vehicle);
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var vehicle = await _dbContext.Vehicles.FindAsync(id, cancellationToken);
           
            if (vehicle is null) 
                return;
            
            _dbContext.Vehicles.Remove(vehicle);
        }
    }
}
