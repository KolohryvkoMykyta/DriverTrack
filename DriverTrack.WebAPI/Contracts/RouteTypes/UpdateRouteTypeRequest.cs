namespace DriverTrack.WebAPI.Contracts.RouteTypes
{
    public record UpdateRouteTypeRequest(
        string Name,
        decimal DriverPayment,
        decimal Revenue);
}
