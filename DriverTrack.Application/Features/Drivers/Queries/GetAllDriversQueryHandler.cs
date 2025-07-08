using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces;
using MediatR;

namespace DriverTrack.Application.Features.Drivers.Queries
{
    public class GetAllDriversQueryHandler : IRequestHandler<GetAllDriversQuery, List<DriverDto>>
    {
        private readonly IDriverRepository _repository;
        private readonly IMapper _mapper;

        public GetAllDriversQueryHandler(IDriverRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<DriverDto>> Handle(GetAllDriversQuery request, CancellationToken cancellationToken)
        {
            var drivers = await _repository.GetAllAsync();
            return _mapper.Map<List<DriverDto>>(drivers);
        }
    }
}
