using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.RouteEntries.Commands.DeleteRoute
{
    public class DeleteRouteCommandHandler : IRequestHandler<DeleteRouteCommand, Unit>
    {
        private readonly IRouteRepository _routeRepository;

        public DeleteRouteCommandHandler(IRouteRepository repository)
        {
            _routeRepository = repository;
        }

        public async Task<Unit> Handle(DeleteRouteCommand request, CancellationToken cancellationToken)
        {
            var route = await _routeRepository.GetByIdAsync(request.Id);

            if (route is null)
                throw new NotFoundException(nameof(RouteEntry), request.Id);

            await _routeRepository.DeleteAsync(request.Id);

            return Unit.Value;
        }
    }
}
