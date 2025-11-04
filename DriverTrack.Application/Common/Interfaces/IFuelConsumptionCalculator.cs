using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Common.Interfaces
{
    public interface IFuelConsumptionCalculator
    {
        Task<(double? Distance, double? Consumption)> CalculateAsync(Guid vehicleId, double odometer, double liters, CancellationToken ct);
    }
}
