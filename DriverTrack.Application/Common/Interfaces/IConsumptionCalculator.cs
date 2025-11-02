using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Common.Interfaces
{
    /// <summary>
    /// Defines a contract for calculating fuel consumption based on average usage and distance.
    /// </summary>
    public interface IConsumptionCalculator
    {
        /// <summary>
        /// Calculates the estimated fuel used (in liters) based on average consumption (L/100km) and distance.
        /// </summary>
        /// <param name="averageConsumption">Average fuel consumption in liters per 100 kilometers.</param>
        /// <param name="totalDistance">Total distance traveled in kilometers.</param>
        /// <returns>Estimated fuel used, or null if the input is invalid.</returns>
        double? CalculateFuelUsed(double? averageConsumption, double totalDistance);
    }
}
