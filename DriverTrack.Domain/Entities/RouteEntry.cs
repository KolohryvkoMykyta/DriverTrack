using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Domain.Entities
{
    public class RouteEntry
    {
        public Guid Id { get; set; }
        public Guid DriverId { get; set; }
        public Driver? Driver { get; set; }

        public Guid VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }

        public Guid RouteTypeId { get; set; }
        public RouteType? RouteType { get; set; }

        public DateTime StartDate { get; set; }
        public double StartOdometer { get; set; }

        public DateTime? EndDate { get; set; }
        public double? EndOdometer { get; set; }

        public double? TotalDistance { get; set; }
        public double? FuelUsed { get; set; }

        public decimal Earnings { get; set; }
    }
}
