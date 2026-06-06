namespace DriverTrack.WebAPI.Contracts.RouteTypes
{
    public record CreateRouteTypeRequest(
        string Name, 
        decimal DriverPayment,
        decimal Revenue);
}
