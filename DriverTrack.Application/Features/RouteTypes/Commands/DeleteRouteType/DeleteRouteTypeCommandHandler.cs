using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.RouteTypes.Commands.DeleteRouteType
{
    public class DeleteRouteTypeCommandHandler : IRequestHandler<DeleteRouteTypeCommand, Unit>
    {
        private readonly IRouteTypeRepository _routeTypeRepository;

        public DeleteRouteTypeCommandHandler(IRouteTypeRepository routeTypeRepository)
        {
            _routeTypeRepository = routeTypeRepository;
        }

        public async Task<Unit> Handle(DeleteRouteTypeCommand request, CancellationToken cancellationToken)
        {
            var routeType = await _routeTypeRepository.GetByIdAsync(request.Id);

            if (routeType is null)
                throw new NotFoundException(nameof(RouteType), request.Id);

            await _routeTypeRepository.DeleteAsync(request.Id);

            return Unit.Value;
        }
    }
}
