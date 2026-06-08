using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using DriverTrack.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DriverTrack.Infrastructure.Repositories
{
    public sealed class StatisticsRepository : IStatisticsRepository
    {
        private readonly DriverTrackDbContext _dbContext;

        public StatisticsRepository(DriverTrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<List<RouteEntry>> GetRoutesForOverviewAsync(
            DateTime? from,
            DateTime? to,
            Guid? driverId,
            Guid? vehicleId,
            CancellationToken cancellationToken = default)
        {
            var query = _dbContext.RouteEntries
                .AsNoTracking()
                .Include(route => route.Driver)
                .Include(route => route.Vehicle)
                .AsQueryable();

            if (from.HasValue)
                query = query.Where(route => route.StartDate >= from.Value);

            if (to.HasValue)
                query = query.Where(route => route.StartDate <= to.Value);

            if (driverId.HasValue)
                query = query.Where(route => route.DriverId == driverId.Value);

            if (vehicleId.HasValue)
                query = query.Where(route => route.VehicleId == vehicleId.Value);

            return query
                .OrderBy(route => route.StartDate)
                .ToListAsync(cancellationToken);
        }

        public Task<List<FuelEntry>> GetFuelEntriesForOverviewAsync(
            DateTime? from,
            DateTime? to,
            Guid? driverId,
            Guid? vehicleId,
            CancellationToken cancellationToken = default)
        {
            var query = _dbContext.FuelEntries
                .AsNoTracking()
                .Include(fuelEntry => fuelEntry.Driver)
                .Include(fuelEntry => fuelEntry.Vehicle)
                .AsQueryable();

            if (from.HasValue)
                query = query.Where(fuelEntry => fuelEntry.Date >= from.Value);

            if (to.HasValue)
                query = query.Where(fuelEntry => fuelEntry.Date <= to.Value);

            if (driverId.HasValue)
                query = query.Where(fuelEntry => fuelEntry.DriverId == driverId.Value);

            if (vehicleId.HasValue)
                query = query.Where(fuelEntry => fuelEntry.VehicleId == vehicleId.Value);

            return query
                .OrderBy(fuelEntry => fuelEntry.Date)
                .ToListAsync(cancellationToken);
        }
    }
}