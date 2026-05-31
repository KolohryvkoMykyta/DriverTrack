using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Commands.UpdateRoute
{
    public class UpdateRouteCommandHandler : IRequestHandler<UpdateRouteCommand, Unit>
    {
        private readonly IRouteRepository _routeRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateRouteCommandHandler(
            IRouteRepository routeRepository,
            IVehicleRepository vehicleRepository,
            IUnitOfWork unitOfWork)
        {
            _routeRepository = routeRepository;
            _vehicleRepository = vehicleRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(UpdateRouteCommand request, CancellationToken cancellationToken)
        {
            var route = await _routeRepository.GetByIdAsync(request.Id, cancellationToken);

            if (route is null)
                throw new NotFoundException(nameof(RouteEntry), request.Id);

            route.VehicleId = request.VehicleId;
            route.RouteTypeId = request.RouteTypeId;
            route.StartDate = request.StartDate;
            route.StartOdometer = request.StartOdometer;
            route.EndDate = request.EndDate;
            route.EndOdometer = request.EndOdometer;

            if (request.TotalDistance is not null)
                route.TotalDistance = request.TotalDistance;
            else if (request.EndOdometer is not null)
                route.TotalDistance = request.EndOdometer - route.StartOdometer;

            route.Earnings = request.Earnings ?? route.Earnings;

            if (route.TotalDistance is not null)
            {
                var vehicle = await _vehicleRepository.GetByIdAsync(route.VehicleId, cancellationToken);

                if (vehicle is null)
                    throw new NotFoundException(nameof(Vehicle), route.VehicleId);

                route.FuelUsed = (vehicle.AverageFuelConsumption is not null && route.TotalDistance!.Value > 0)
                        ? Math.Round(vehicle.AverageFuelConsumption.Value * route.TotalDistance.Value / 100.0, 2)
                        : null;
            }

            _routeRepository.Update(route);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
