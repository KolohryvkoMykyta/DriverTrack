using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Queries.GetFuelByDriverId
{
    public record GetFuelByDriverIdQuery(
        Guid DriverId,
        DateTime? From = null,
        DateTime? To = null
    ) : IRequest<List<FuelEntryDto>>;
}
