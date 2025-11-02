using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Common.Interfaces
{
    public interface IFuelConsumptionUpdater
    {
        /// <summary>
        /// Calculates fuel consumption in L/100km between the previous and current fuel entry.
        /// </summary>
        Task<double?> CalculateFuelConsumptionAsync(Guid vehicleId, double currentOdometer, double liters);

        /// <summary>
        /// Recalculates and updates the average fuel consumption for a given vehicle.
        /// </summary>
        Task UpdateAverageFuelConsumptionAsync(Guid vehicleId);
    }
}
