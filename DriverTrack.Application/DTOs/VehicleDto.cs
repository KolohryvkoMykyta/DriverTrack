namespace DriverTrack.Application.DTOs
{
    public class VehicleDto
    {
        public Guid Id { get; set; }
        public string Brand { get; set; } = default!;
        public string Model { get; set; } = default!;
        public string LicensePlate { get; set; } = default!;
        public bool IsActive { get; set; }

        public Guid? DriverId { get; set; }

        public double? AverageFuelConsumption { get; set; }
    }
}
