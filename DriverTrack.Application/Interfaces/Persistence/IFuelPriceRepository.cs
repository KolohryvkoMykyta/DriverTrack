using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Interfaces.Persistence
{
    public interface IFuelPriceRepository
    {
        Task<FuelPrice?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

        Task<List<FuelPrice>> GetAllAsync(CancellationToken cancellationToken = default);

        Task<FuelPrice?> GetCurrentPriceAsync(DateTime date, CancellationToken cancellationToken = default);

        Task AddAsync(FuelPrice fuelPrice, CancellationToken cancellationToken = default);

        void Update(FuelPrice fuelPrice);

        Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    }
}