using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using DriverTrack.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DriverTrack.Infrastructure.Repositories
{
    public sealed class RouteRepository : IRouteRepository
    {
        private readonly DriverTrackDbContext _dbContext;

        public RouteRepository(DriverTrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<RouteEntry?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return _dbContext.RouteEntries
                .AsNoTracking()
                .FirstOrDefaultAsync(re => re.Id == id, cancellationToken);
        }

        public Task<List<RouteEntry>> GetWithFiltersAsync(Guid? driverId, DateTime? from = null, DateTime? to = null, CancellationToken cancellationToken = default)
        {
            var query = _dbContext.RouteEntries.AsNoTracking().AsQueryable();

            if (driverId.HasValue) query = query.Where(re => re.DriverId == driverId.Value);
            if (from.HasValue) query = query.Where(re => re.StartDate >= from.Value);
            if (to.HasValue) query = query.Where(re => re.StartDate <= to.Value);

            return query
                .OrderBy(re => re.StartDate)
                .ToListAsync(cancellationToken);
        }

        public Task<RouteEntry?> GetOpenRouteAsync(Guid driverId, CancellationToken cancellationToken = default)
        {
            return _dbContext.RouteEntries
                .AsNoTracking()
                .FirstOrDefaultAsync(re =>
                    re.DriverId == driverId &&
                    re.EndDate == null,
                    cancellationToken);
        }

        public async Task AddAsync(RouteEntry routeEntry, CancellationToken cancellationToken = default)
        {
            await _dbContext.RouteEntries.AddAsync(routeEntry, cancellationToken);
        }

        public void Update(RouteEntry routeEntry)
        {
            _dbContext.RouteEntries.Update(routeEntry);
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var routeEntry = await _dbContext.RouteEntries.FindAsync(id, cancellationToken);

            if (routeEntry is null)
                return;

            _dbContext.RouteEntries.Remove(routeEntry);
        }
    }
}
