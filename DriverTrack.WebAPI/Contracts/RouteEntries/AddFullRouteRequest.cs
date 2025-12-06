namespace DriverTrack.WebAPI.Contracts.RouteEntries
{
    public record AddFullRouteRequest(
        Guid DriverId,
        Guid VehicleId,
        Guid RouteTypeId,
        DateTime StartDate,
        double StartOdometer,
        DateTime EndDate,
        double EndOdometer,
        double? TotalDistance);
}
