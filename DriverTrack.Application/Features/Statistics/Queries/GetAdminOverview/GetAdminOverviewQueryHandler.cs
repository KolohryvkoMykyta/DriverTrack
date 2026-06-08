using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using MediatR;

namespace DriverTrack.Application.Features.Statistics.Queries.GetAdminOverview
{
    public sealed class GetAdminOverviewQueryHandler
        : IRequestHandler<GetAdminOverviewQuery, AdminOverviewDto>
    {
        private readonly IStatisticsRepository _statisticsRepository;
        private readonly IFuelPriceRepository _fuelPriceRepository;
        private readonly IFuelCostCalculator _fuelCostCalculator;
        private readonly IOverviewStatisticsBuilder _overviewStatisticsBuilder;

        public GetAdminOverviewQueryHandler(
            IStatisticsRepository statisticsRepository,
            IFuelPriceRepository fuelPriceRepository,
            IFuelCostCalculator fuelCostCalculator,
            IOverviewStatisticsBuilder overviewStatisticsBuilder)
        {
            _statisticsRepository = statisticsRepository;
            _fuelPriceRepository = fuelPriceRepository;
            _fuelCostCalculator = fuelCostCalculator;
            _overviewStatisticsBuilder = overviewStatisticsBuilder;
        }

        public async Task<AdminOverviewDto> Handle(
            GetAdminOverviewQuery request,
            CancellationToken cancellationToken)
        {
            var routes = await _statisticsRepository.GetRoutesForOverviewAsync(
                request.From,
                request.To,
                request.DriverId,
                request.VehicleId,
                cancellationToken);

            var fuelEntries = await _statisticsRepository.GetFuelEntriesForOverviewAsync(
                request.From,
                request.To,
                request.DriverId,
                request.VehicleId,
                cancellationToken);

            var currentFuelPrice = await _fuelPriceRepository.GetCurrentPriceAsync(
                DateTime.UtcNow,
                cancellationToken);

            var totalRevenue = routes.Sum(route => route.Revenue);
            var totalDriverPayment = routes.Sum(route => route.DriverPayment);
            var totalFuelCost = await _fuelCostCalculator.CalculateAsync(
                fuelEntries,
                cancellationToken);

            var totalDistance = routes.Sum(route => route.TotalDistance ?? 0);
            var totalFuelLiters = fuelEntries.Sum(fuelEntry => fuelEntry.Liters);

            var drivers = await _overviewStatisticsBuilder.BuildDriversAsync(
                routes,
                fuelEntries,
                cancellationToken);

            var vehicles = _overviewStatisticsBuilder.BuildVehicles(
                routes,
                fuelEntries);

            return new AdminOverviewDto
            {
                TotalRevenue = totalRevenue,
                TotalDriverPayment = totalDriverPayment,
                TotalFuelCost = totalFuelCost,
                NetProfit = totalRevenue - totalDriverPayment - totalFuelCost,

                RouteCount = routes.Count,
                TotalDistance = totalDistance,
                TotalFuelLiters = totalFuelLiters,
                AverageFuelConsumption = totalDistance > 0 && totalFuelLiters > 0
                    ? Math.Round(totalFuelLiters / totalDistance * 100, 2)
                    : null,

                CurrentFuelPrice = currentFuelPrice is null
                    ? null
                    : new FuelPriceDto
                    {
                        Id = currentFuelPrice.Id,
                        PricePerLiter = currentFuelPrice.PricePerLiter,
                        EffectiveFrom = currentFuelPrice.EffectiveFrom
                    },

                Drivers = drivers,
                Vehicles = vehicles
            };
        }
    }
}