namespace DriverTrack.WebAPI.Contracts.RouteEntries
{
    public record UpdateRouteRequest(
    Guid VehicleId,
    Guid RouteTypeId,
    DateTime StartDate,
    double StartOdometer,
    DateTime? EndDate,
    double? EndOdometer,
    double? TotalDistance,
    decimal Earnings);
}
