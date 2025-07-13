using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.DTOs
{
    public class RouteTypeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public decimal Earnings { get; set; }
    }
}
