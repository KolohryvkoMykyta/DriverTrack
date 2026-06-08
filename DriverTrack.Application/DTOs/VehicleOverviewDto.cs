namespace DriverTrack.Application.DTOs
{
    public class VehicleOverviewDto
    {
        public Guid VehicleId { get; set; }

        public string VehicleName { get; set; } = string.Empty;

        public string LicensePlate { get; set; } = string.Empty;

        public int RouteCount { get; set; }

        public double TotalDistance { get; set; }

        public double TotalFuelLiters { get; set; }

        public double? AverageFuelConsumption { get; set; }
    }
}