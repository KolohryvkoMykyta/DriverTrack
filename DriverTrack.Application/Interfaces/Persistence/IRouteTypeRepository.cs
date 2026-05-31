using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Interfaces.Persistence;

public interface IRouteTypeRepository
{
    Task<RouteType?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<RouteType>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(RouteType routeType, CancellationToken cancellationToken = default);
    void Update(RouteType routeType);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}