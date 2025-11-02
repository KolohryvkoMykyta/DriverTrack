namespace DriverTrack.Application.DTOs
{
    public class RouteEntryDto
    {
        public Guid Id { get; set; }
        public Guid DriverId { get; set; }
        public Guid VehicleId { get; set; }
        public Guid RouteTypeId { get; set; }

        public DateTime StartDate { get; set; }
        public double StartOdometer { get; set; }

        public DateTime? EndDate { get; set; }
        public double? EndOdometer { get; set; }

        public double? TotalDistance { get; set; }
        public double? FuelUsed { get; set; }

        public decimal Earnings { get; set; }
    }
}
