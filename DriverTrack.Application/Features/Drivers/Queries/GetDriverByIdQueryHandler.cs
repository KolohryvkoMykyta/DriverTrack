using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces;
using MediatR;

namespace DriverTrack.Application.Features.Drivers.Queries
{
    public class GetDriverByIdQueryHandler : IRequestHandler<GetDriverByIdQuery, DriverDto?>
    {
        private readonly IDriverRepository _repository;
        private readonly IMapper _mapper;

        public GetDriverByIdQueryHandler(IDriverRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<DriverDto?> Handle(GetDriverByIdQuery request, CancellationToken cancellationToken)
        {
            var driver = await _repository.GetByIdAsync(request.Id, cancellationToken);
            return driver == null ? null : _mapper.Map<DriverDto>(driver);
        }
    }
}
