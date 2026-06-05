using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Interfaces.Persistence
{
    public interface IVehicleRepository
    {
        Task<Vehicle?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<Vehicle>> GetByDriverIdAsync(Guid driverId, CancellationToken cancellationToken = default);
        Task<List<Vehicle>> GetAllAsync(CancellationToken cancellationToken = default);
        Task AddAsync(Vehicle vehicle, CancellationToken cancellationToken = default);
        void Update(Vehicle vehicle);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
