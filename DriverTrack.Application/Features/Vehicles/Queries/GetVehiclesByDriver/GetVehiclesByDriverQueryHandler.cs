using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Features.Vehicles.Queries.GetVehiclesByDriver
{
    public class GetVehiclesByDriverQueryHandler : IRequestHandler<GetVehiclesByDriverQuery, List<VehicleDto>>
    {
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IMapper _mapper;

        public GetVehiclesByDriverQueryHandler(IVehicleRepository vehicleRepository, IMapper mapper)
        {
            _vehicleRepository = vehicleRepository;
            _mapper = mapper;
        }

        public async Task<List<VehicleDto>> Handle(GetVehiclesByDriverQuery request, CancellationToken cancellationToken)
        {
            var vehicles = await _vehicleRepository.GetByDriverIdAsync(request.DriverId);
            return _mapper.Map<List<VehicleDto>>(vehicles);
        }
    }
}
