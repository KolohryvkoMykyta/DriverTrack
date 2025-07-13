using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.RouteTypes.Commands.UpdateRouteType
{
    public class UpdateRouteTypeCommandHandler : IRequestHandler<UpdateRouteTypeCommand, Unit>
    {
        private readonly IRouteTypeRepository _routeTypeRepository;

        public UpdateRouteTypeCommandHandler(IRouteTypeRepository routeTypeRepository)
        {
            _routeTypeRepository = routeTypeRepository;
        }

        public async Task<Unit> Handle(UpdateRouteTypeCommand request, CancellationToken cancellationToken)
        {
            var routeType = await _routeTypeRepository.GetByIdAsync(request.Id);

            if (routeType is null)
                throw new NotFoundException(nameof(RouteType), request.Id);

            routeType.Name = request.Name;
            routeType.Earnings = request.Earnings;

            await _routeTypeRepository.UpdateAsync(routeType);

            return Unit.Value;
        }
    }
}
