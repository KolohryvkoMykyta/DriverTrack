using AutoMapper;
using DriverTrack.Application.Common.Constants;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Queries.GetRouteById
{
    public class GetRouteByIdQueryHandler : IRequestHandler<GetRouteByIdQuery, RouteDetailsDto>
    {
        private readonly IRouteRepository _routeRepository;
        private readonly IFuelCostCalculator _fuelCostCalculator;
        private readonly IMapper _mapper;

        public GetRouteByIdQueryHandler(
            IRouteRepository routeRepository,
            IFuelCostCalculator fuelCostCalculator,
            IMapper mapper)
        {
            _routeRepository = routeRepository;
            _fuelCostCalculator = fuelCostCalculator;
            _mapper = mapper;
        }

        public async Task<RouteDetailsDto> Handle(
            GetRouteByIdQuery request,
            CancellationToken cancellationToken)
        {
            var route = await _routeRepository.GetByIdAsync(request.Id, cancellationToken);

            if (route is null)
                throw new NotFoundException(nameof(RouteEntry), request.Id);

            var routeDetails = _mapper.Map<RouteDetailsDto>(route);

            if (!route.FuelUsed.HasValue)
                return routeDetails;

            routeDetails.FuelCost = await _fuelCostCalculator.CalculateAsync(
                route.FuelUsed.Value,
                route.StartDate,
                cancellationToken);

            if (routeDetails.FuelCost.HasValue)
            {
                routeDetails.NetProfit =
                    route.Revenue -
                    route.DriverPayment -
                    routeDetails.FuelCost.Value;
            }

            return routeDetails;
        }
    }
}