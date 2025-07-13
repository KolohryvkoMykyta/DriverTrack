using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.RouteTypes.Commands.CreateRouteType
{
    public class CreateRouteTypeCommandHandler : IRequestHandler<CreateRouteTypeCommand, Guid>
    {
        private readonly IRouteTypeRepository _routeTypeRepository;

        public CreateRouteTypeCommandHandler(IRouteTypeRepository routeTypeRepository)
        {
            _routeTypeRepository = routeTypeRepository;
        }

        public async Task<Guid> Handle(CreateRouteTypeCommand request, CancellationToken cancellationToken)
        {
            var routeType = new RouteType
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Earnings = request.Earnings
            };

            await _routeTypeRepository.AddAsync(routeType);

            return routeType.Id;
        }
    }
}
