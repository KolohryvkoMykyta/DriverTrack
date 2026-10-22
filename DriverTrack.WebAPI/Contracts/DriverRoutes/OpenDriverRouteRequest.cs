namespace DriverTrack.WebAPI.Contracts.DriverRoutes;

public sealed record OpenDriverRouteRequest(
    Guid VehicleId,
    Guid RouteTypeId,
    DateTime StartDate,
    double StartOdometer);