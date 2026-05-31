using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Interfaces.Persistence;

public interface IRouteRepository
{
    Task<RouteEntry?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<RouteEntry>> GetWithFiltersAsync(Guid? driverId, DateTime? from = null, DateTime? to = null, CancellationToken cancellationToken = default);
    Task<RouteEntry?> GetOpenRouteAsync(Guid driverId, CancellationToken cancellationToken = default);
    Task AddAsync(RouteEntry routeEntry, CancellationToken cancellationToken = default);
    void Update(RouteEntry routeEntry);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}