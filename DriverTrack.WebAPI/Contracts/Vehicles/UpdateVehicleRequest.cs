namespace DriverTrack.WebAPI.Contracts.Vehicles
{
    public record UpdateVehicleRequest(
        string Brand, 
        string Model, 
        string LicensePlate,
        bool IsActive, 
        Guid? DriverId);
}
