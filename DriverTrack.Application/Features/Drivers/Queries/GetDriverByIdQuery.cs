using MediatR;
using DriverTrack.Application.DTOs;

namespace DriverTrack.Application.Features.Drivers.Queries
{
    public record GetDriverByIdQuery(Guid Id) : IRequest<DriverDto>;
}
