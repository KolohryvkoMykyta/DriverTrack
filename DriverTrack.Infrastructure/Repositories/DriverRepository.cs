using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using DriverTrack.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DriverTrack.Infrastructure.Repositories
{
    public sealed class DriverRepository : IDriverRepository
    {
        private readonly DriverTrackDbContext _dbContext;

        public DriverRepository(DriverTrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Driver?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Drivers
                .AsNoTracking()
                .FirstOrDefaultAsync(driver => driver.Id == id, cancellationToken);
        }

        public async Task<List<Driver>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.Drivers
                .AsNoTracking()
                .OrderBy(driver => driver.Name)
                .ToListAsync(cancellationToken);
        }

        public async Task AddAsync(Driver driver, CancellationToken cancellationToken = default)
        {
            await _dbContext.Drivers.AddAsync(driver, cancellationToken);
        }

        public void Update(Driver driver)
        {
            _dbContext.Drivers.Update(driver);
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var driver = await _dbContext.Drivers.FindAsync(id, cancellationToken);

            if (driver is null)
                return;

            _dbContext.Drivers.Remove(driver);
        }
    }
}
