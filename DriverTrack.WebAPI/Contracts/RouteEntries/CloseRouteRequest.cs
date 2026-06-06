namespace DriverTrack.WebAPI.Contracts.RouteEntries
{
    public record CloseRouteRequest(
        double EndOdometer, 
        DateTime? EndDate);
}
