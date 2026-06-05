namespace DriverTrack.Domain.Entities
{
    public class Vehicle
    {
        public Guid Id { get; set; }
        public string Brand { get; set; } = default!;
        public string Model { get; set; } = default!;
        public string LicensePlate { get; set; } = default!;
        public bool IsActive { get; set; } = true;

        public Guid? DriverId { get; set; }
        public Driver? Driver { get; set; }

        public double? AverageFuelConsumption { get; set; }

        public ICollection<FuelEntry> FuelEntries { get; set; } = new List<FuelEntry>();
        public ICollection<RouteEntry> RouteEntries { get; set; } = new List<RouteEntry>();
    }
}
