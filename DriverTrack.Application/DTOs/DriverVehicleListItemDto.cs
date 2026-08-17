namespace DriverTrack.Application.DTOs
{
    public class DriverVehicleListItemDto
    {
        public Guid Id { get; set; }
        public string Brand { get; set; } = default!;
        public string Model { get; set; } = default!;
        public string LicensePlate { get; set; } = default!;
    }
}