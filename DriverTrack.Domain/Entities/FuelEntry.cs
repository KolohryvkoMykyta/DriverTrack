namespace DriverTrack.Domain.Entities
{
    public class FuelEntry
    {
        public Guid Id { get; set; }
        public Guid DriverId { get; set; }
        public Driver? Driver { get; set; }

        public Guid VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }

        public DateTime Date { get; set; }
        public double OdometerReading { get; set; }
        public double Liters { get; set; }

        public bool IsFullTank { get; set; }

        public double? DistanceSinceLastRefuel { get; set; }
        public double? FuelConsumption { get; set; }
    }
}
