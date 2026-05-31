using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Interfaces.Persistence
{
    public interface IDriverRepository
    {
        Task<Driver?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<Driver>> GetAllAsync(CancellationToken cancellationToken = default);
        Task AddAsync(Driver driver, CancellationToken cancellationToken = default);
        void Update(Driver driver);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
