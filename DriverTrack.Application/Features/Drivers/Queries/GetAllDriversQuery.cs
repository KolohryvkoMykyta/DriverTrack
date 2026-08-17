using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.Drivers.Queries
{
    public record GetAllDriversQuery() : IRequest<List<DriverListItemDto>>;
}
