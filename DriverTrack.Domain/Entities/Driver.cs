using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Domain.Entities
{
    public class Driver
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string PhoneNumber { get; set; } = default!;
        public bool IsActive { get; set; } = true;

        public ICollection<RouteEntry> RouteEntries { get; set; } = new List<RouteEntry>();
        public ICollection<FuelEntry> FuelEntries { get; set; } = new List<FuelEntry>();
        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
    }
}
