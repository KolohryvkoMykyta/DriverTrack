using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Common.Interfaces
{
    public interface IVehicleAverageConsumptionCalculator
    {
        Task<double?> CalculateAsync(Guid vehicleId, CancellationToken ct);
    }
}
