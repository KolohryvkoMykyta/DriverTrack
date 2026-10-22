namespace DriverTrack.WebAPI.Contracts.DriverRoutes;

public sealed record OpenDriverRouteResponse(
    Guid Id,
    Guid VehicleId,
    Guid RouteTypeId,
    DateTime StartDate,
    double StartOdometer,
    decimal DriverPayment);