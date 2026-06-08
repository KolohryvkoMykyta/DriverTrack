using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using DriverTrack.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DriverTrack.Infrastructure.Repositories
{
    public sealed class FuelEntryRepository : IFuelEntryRepository
    {
        private readonly DriverTrackDbContext _dbContext;

        public FuelEntryRepository(DriverTrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddAsync(FuelEntry fuelEntry, CancellationToken cancellationToken = default)
        {
            await _dbContext.FuelEntries.AddAsync(fuelEntry, cancellationToken);
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var fuelEntry = await _dbContext.FuelEntries.FindAsync(id, cancellationToken);
            if (fuelEntry is null)
                return;

            _dbContext.FuelEntries.Remove(fuelEntry);
        }

        public Task<List<FuelEntry>> GetByDriverIdAsync(Guid driverId, DateTime? from = null, DateTime? to = null, CancellationToken cancellationToken = default)
        {
            var query = _dbContext.FuelEntries
                .AsNoTracking()
                .Where(fe => fe.DriverId == driverId);

            if (from.HasValue) query = query.Where(fe => fe.Date >= from.Value);
            
            if (to.HasValue) query = query.Where(fe => fe.Date <= to.Value);

            return query.OrderBy(fe => fe.Date).ToListAsync(cancellationToken);
        }

        public Task<FuelEntry?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return _dbContext.FuelEntries
                .AsNoTracking()
                .FirstOrDefaultAsync(fe => fe.Id == id, cancellationToken);
        }

        public Task<List<FuelEntry>> GetByVehicleIdAsync(Guid vehicleId, DateTime? from = null, DateTime? to = null, CancellationToken cancellationToken = default)
        {
            var query = _dbContext.FuelEntries
                .AsNoTracking()
                .Where(fe => fe.VehicleId == vehicleId);

            if (from.HasValue) query = query.Where(fe => fe.Date >= from.Value);

            if (to.HasValue) query = query.Where(fe => fe.Date <= to.Value);

            return query.OrderBy(fe => fe.Date).ToListAsync(cancellationToken);
        }

        public Task<List<FuelEntry>> GetWithFiltersAsync(DateTime? from = null, DateTime? to = null, CancellationToken cancellationToken = default)
        {
            var query = _dbContext.FuelEntries
                .AsNoTracking()
                .AsQueryable();

            if (from.HasValue)
                query = query.Where(fe => fe.Date >= from.Value);

            if (to.HasValue)
                query = query.Where(fe => fe.Date <= to.Value);

            return query
                .OrderBy(fe => fe.Date)
                .ToListAsync(cancellationToken);
        }

        public void Update(FuelEntry fuelEntry)
        {
            _dbContext.FuelEntries.Update(fuelEntry);
        }
    }
}
