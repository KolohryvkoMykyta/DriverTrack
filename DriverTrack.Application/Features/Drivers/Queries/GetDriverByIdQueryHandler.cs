using AutoMapper;
using DriverTrack.Application.Common.Exceptions;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces;
using DriverTrack.Domain.Entities;
using MediatR;

namespace DriverTrack.Application.Features.Drivers.Queries
{
    public class GetDriverByIdQueryHandler : IRequestHandler<GetDriverByIdQuery, DriverDto>
    {
        private readonly IDriverRepository _driverRepository;
        private readonly IMapper _mapper;

        public GetDriverByIdQueryHandler(IDriverRepository driverRepository, IMapper mapper)
        {
            _driverRepository = driverRepository;
            _mapper = mapper;
        }

        public async Task<DriverDto> Handle(GetDriverByIdQuery request, CancellationToken cancellationToken)
        {
            var driver = await _driverRepository.GetByIdAsync(request.Id, cancellationToken);
            if (driver is null)
                throw new NotFoundException(nameof(Driver), request.Id);

            return _mapper.Map<DriverDto>(driver);
        }
    }
}
