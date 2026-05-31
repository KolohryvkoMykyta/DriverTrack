using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.RouteEntries.Commands.DeleteRoute
{
    public class DeleteRouteCommandHandler : IRequestHandler<DeleteRouteCommand, Unit>
    {
        private readonly IRouteRepository _routeRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteRouteCommandHandler(IRouteRepository repository, IUnitOfWork unitOfWork)
        {
            _routeRepository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(DeleteRouteCommand request, CancellationToken cancellationToken)
        {
            var route = await _routeRepository.GetByIdAsync(request.Id, cancellationToken);

            if (route is null)
                throw new NotFoundException(nameof(RouteEntry), request.Id);

            await _routeRepository.DeleteAsync(request.Id, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
