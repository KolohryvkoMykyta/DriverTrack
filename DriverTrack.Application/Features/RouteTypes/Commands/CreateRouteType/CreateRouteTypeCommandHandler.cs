using DriverTrack.Application.Interfaces.Persistence;
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
        private readonly IUnitOfWork _unitOfWork;

        public CreateRouteTypeCommandHandler(IRouteTypeRepository routeTypeRepository, IUnitOfWork unitOfWork)
        {
            _routeTypeRepository = routeTypeRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(CreateRouteTypeCommand request, CancellationToken cancellationToken)
        {
            var routeType = new RouteType
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                DriverPayment = request.DriverPayment,
                Revenue = request.Revenue
            };

            await _routeTypeRepository.AddAsync(routeType, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return routeType.Id;
        }
    }
}
