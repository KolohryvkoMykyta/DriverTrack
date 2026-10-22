namespace DriverTrack.WebAPI.Contracts.DriverRouteTypes;

public sealed record DriverRouteTypeResponse(
    Guid Id,
    string Name,
    decimal DriverPayment);