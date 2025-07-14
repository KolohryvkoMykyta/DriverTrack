using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.DTOs
{
    public class FuelEntryDto
    {
        public Guid Id { get; set; }
        public Guid DriverId { get; set; }
        public Guid VehicleId { get; set; }

        public DateTime Date { get; set; }
        public double OdometerReading { get; set; }
        public double Liters { get; set; }
        public double? FuelConsumption { get; set; }
    }
}
