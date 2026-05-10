using DriverTrack.Application.Common.Constants.ErrorMessages;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Commands.Create
{
    public class CreateRouteCommandHandler : IRequestHandler<CreateRouteCommand, Guid>
    {
        private readonly IRouteRepository _routeRepository;
        private readonly IRouteTypeRepository _routeTypeRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateRouteCommandHandler(
            IRouteRepository routeRepository,
            IRouteTypeRepository routeTypeRepository,
            IUnitOfWork unitOfWork)
        {
            _routeRepository = routeRepository;
            _routeTypeRepository = routeTypeRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(CreateRouteCommand request, CancellationToken cancellationToken)
        {
            var openRoute = await _routeRepository.GetOpenRouteAsync(request.DriverId, cancellationToken);

            if (openRoute is not null)
                throw new BusinessException(ErrorMessages.Route.OpenAlreadyExists);

            var routeType = await _routeTypeRepository.GetByIdAsync(request.RouteTypeId, cancellationToken);
            
            if (routeType == null)
                throw new NotFoundException(nameof(RouteType), request.RouteTypeId);

            var route = new RouteEntry
            {
                Id = Guid.NewGuid(),
                DriverId = request.DriverId,
                VehicleId = request.VehicleId,
                RouteTypeId = request.RouteTypeId,
                StartDate = request.StartDate,
                StartOdometer = request.StartOdometer,
                Earnings = routeType.Earnings
            };

            await _routeRepository.AddAsync(route, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return route.Id;
        }
    }
}
