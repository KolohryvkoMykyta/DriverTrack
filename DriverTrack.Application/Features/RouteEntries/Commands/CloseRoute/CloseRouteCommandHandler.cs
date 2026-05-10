using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Commands.CloseRoute
{
    public class CloseRouteCommandHandler : IRequestHandler<CloseRouteCommand, Unit>
    {
        private readonly IRouteRepository _routeRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CloseRouteCommandHandler(IRouteRepository repository, IVehicleRepository vehicleRepository, IUnitOfWork unitOfWork)
        {
            _routeRepository = repository;
            _vehicleRepository = vehicleRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(CloseRouteCommand request, CancellationToken cancellationToken)
        {
            var route = await _routeRepository.GetByIdAsync(request.RouteId, cancellationToken);

            if (route is null)
                throw new NotFoundException(nameof(RouteEntry), request.RouteId);

            if (route.EndDate is not null)
                throw new BusinessException(ErrorMessages.Route.AlreadyClosed);

            route.EndOdometer = request.EndOdometer;
            route.EndDate = request.EndDate ?? DateTime.UtcNow;

            if (route.EndOdometer is not null)
                route.TotalDistance = route.EndOdometer - route.StartOdometer;

            if (route.TotalDistance is not null)
            {
                var vehicle = await _vehicleRepository.GetByIdAsync(route.VehicleId, cancellationToken);
                
                if (vehicle is null)
                    throw new NotFoundException(nameof(Vehicle), route.VehicleId);

                if (vehicle.AverageFuelConsumption is not null && route.TotalDistance!.Value > 0)
                {
                    route.FuelUsed = Math.Round(
                        route.TotalDistance!.Value * vehicle.AverageFuelConsumption!.Value / 100.0,
                        2);
                }
                else
                {
                    route.FuelUsed = null;
                }
            }

            _routeRepository.Update(route);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
