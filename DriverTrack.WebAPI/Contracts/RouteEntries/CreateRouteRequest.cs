namespace DriverTrack.WebAPI.Contracts.RouteEntries
{
    public record CreateRouteRequest(
        Guid DriverId,
        Guid VehicleId,
        Guid RouteTypeId,
        DateTime StartDate,
        double StartOdometer);
}
