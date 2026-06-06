using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using DriverTrack.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace DriverTrack.Infrastructure.Repositories
{
    public sealed class FuelPriceRepository : IFuelPriceRepository
    {
        private readonly DriverTrackDbContext _dbContext;

        public FuelPriceRepository(DriverTrackDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<FuelPrice?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return _dbContext.FuelPrices
                .AsNoTracking()
                .FirstOrDefaultAsync(fuelPrice => fuelPrice.Id == id, cancellationToken);
        }

        public Task<List<FuelPrice>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return _dbContext.FuelPrices
                .AsNoTracking()
                .OrderByDescending(fuelPrice => fuelPrice.EffectiveFrom)
                .ToListAsync(cancellationToken);
        }

        public Task<FuelPrice?> GetCurrentPriceAsync(DateTime date, CancellationToken cancellationToken = default)
        {
            return _dbContext.FuelPrices
                .AsNoTracking()
                .Where(fuelPrice => fuelPrice.EffectiveFrom <= date)
                .OrderByDescending(fuelPrice => fuelPrice.EffectiveFrom)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task AddAsync(FuelPrice fuelPrice, CancellationToken cancellationToken = default)
        {
            await _dbContext.FuelPrices.AddAsync(fuelPrice, cancellationToken);
        }

        public void Update(FuelPrice fuelPrice)
        {
            _dbContext.FuelPrices.Update(fuelPrice);
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var fuelPrice = await _dbContext.FuelPrices.FindAsync(id, cancellationToken);

            if (fuelPrice is null)
                return;

            _dbContext.FuelPrices.Remove(fuelPrice);
        }
    }
}