using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Interfaces;

public interface IRouteTypeRepository
{
    Task<RouteType?> GetByIdAsync(Guid id);
    Task<List<RouteType>> GetAllAsync();
    Task AddAsync(RouteType routeType);
    Task UpdateAsync(RouteType routeType);
    Task DeleteAsync(Guid id);
}