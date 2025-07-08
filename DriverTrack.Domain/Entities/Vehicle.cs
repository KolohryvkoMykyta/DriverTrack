using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Domain.Entities
{
    public class Vehicle
    {
        public Guid Id { get; set; }
        public string Model { get; set; } = default!;
        public string LicensePlate { get; set; } = default!;

        public Guid DriverId { get; set; }
        public Driver? Driver { get; set; }

        public ICollection<FuelEntry> FuelEntries { get; set; } = new List<FuelEntry>();
        public ICollection<RouteEntry> RouteEntries { get; set; } = new List<RouteEntry>();
    }
}
