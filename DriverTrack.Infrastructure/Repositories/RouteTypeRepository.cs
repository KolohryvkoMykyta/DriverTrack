using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using DriverTrack.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DriverTrack.Infrastructure.Repositories
{
    public sealed class RouteTypeRepository : IRouteTypeRepository
    {
        private readonly DriverTrackDbContext _dbContext;

        public RouteTypeRepository(DriverTrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<RouteType?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return _dbContext.RouteTypes
                .AsNoTracking()
                .FirstOrDefaultAsync(rt => rt.Id == id, cancellationToken);
        }

        public Task<List<RouteType>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return _dbContext.RouteTypes
                .AsNoTracking()
                .OrderBy(rt => rt.Name)
                .ToListAsync(cancellationToken);
        }

        public async Task AddAsync(RouteType routeType, CancellationToken cancellationToken = default)
        {
            await _dbContext.RouteTypes.AddAsync(routeType, cancellationToken);
        }

        public void Update(RouteType routeType)
        {
            _dbContext.RouteTypes.Update(routeType);
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var routeType = await _dbContext.RouteTypes.FindAsync(id, cancellationToken);

            if (routeType is null)
                return;

            _dbContext.RouteTypes.Remove(routeType);
        }
    }
}
