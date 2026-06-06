namespace DriverTrack.WebAPI.Contracts.Vehicles
{
    public record CreateVehicleRequest(
        string Brand, 
        string Model,
        string LicensePlate, 
        Guid? DriverId);
}
