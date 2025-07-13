using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Interfaces;

public interface IRouteRepository
{
    Task<RouteEntry?> GetByIdAsync(Guid id);
    Task<List<RouteEntry>> GetByDriverIdWithDateFilterAsync(Guid driverId, DateTime? from = null, DateTime? to = null);
    Task<RouteEntry?> GetOpenRouteAsync(Guid driverId);
    Task AddAsync(RouteEntry routeEntry);
    Task UpdateAsync(RouteEntry routeEntry);
    Task DeleteAsync(Guid id);
}