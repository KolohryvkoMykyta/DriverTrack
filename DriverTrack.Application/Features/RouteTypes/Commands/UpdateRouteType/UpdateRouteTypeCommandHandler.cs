using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.RouteTypes.Commands.UpdateRouteType
{
    public class UpdateRouteTypeCommandHandler : IRequestHandler<UpdateRouteTypeCommand, Unit>
    {
        private readonly IRouteTypeRepository _routeTypeRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateRouteTypeCommandHandler(IRouteTypeRepository routeTypeRepository, IUnitOfWork unitOfWork)
        {
            _routeTypeRepository = routeTypeRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(UpdateRouteTypeCommand request, CancellationToken cancellationToken)
        {
            var routeType = await _routeTypeRepository.GetByIdAsync(request.Id, cancellationToken);

            if (routeType is null)
                throw new NotFoundException(nameof(RouteType), request.Id);

            routeType.Name = request.Name;
            routeType.Earnings = request.Earnings;

            _routeTypeRepository.Update(routeType);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
