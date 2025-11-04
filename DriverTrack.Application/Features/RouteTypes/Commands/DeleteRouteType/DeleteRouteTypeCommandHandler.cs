using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.RouteTypes.Commands.DeleteRouteType
{
    public class DeleteRouteTypeCommandHandler : IRequestHandler<DeleteRouteTypeCommand, Unit>
    {
        private readonly IRouteTypeRepository _routeTypeRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteRouteTypeCommandHandler(IRouteTypeRepository routeTypeRepository, IUnitOfWork unitOfWork)
        {
            _routeTypeRepository = routeTypeRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(DeleteRouteTypeCommand request, CancellationToken cancellationToken)
        {
            var routeType = await _routeTypeRepository.GetByIdAsync(request.Id, cancellationToken);

            if (routeType is null)
                throw new NotFoundException(nameof(RouteType), request.Id);

            await _routeTypeRepository.DeleteAsync(request.Id, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
