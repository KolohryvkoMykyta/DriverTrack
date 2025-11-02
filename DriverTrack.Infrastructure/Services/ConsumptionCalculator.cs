using DriverTrack.Application.Common.Interfaces;

namespace DriverTrack.Infrastructure.Services
{
    public class ConsumptionCalculator : IConsumptionCalculator
    {
        /// <summary>
        /// Calculates the fuel used based on average consumption and total distance.
        /// </summary>
        /// <param name="averageConsumption">Average fuel consumption in liters per 100km.</param>
        /// <param name="totalDistance">Total distance in kilometers.</param>
        /// <returns>Fuel used in liters, or null if input is invalid.</returns>
        public double? CalculateFuelUsed(double? averageConsumption, double totalDistance)
        {
            if (averageConsumption is null || totalDistance <= 0)
                return null;

            return (averageConsumption.Value / 100.0) * totalDistance;
        }
    }
}
