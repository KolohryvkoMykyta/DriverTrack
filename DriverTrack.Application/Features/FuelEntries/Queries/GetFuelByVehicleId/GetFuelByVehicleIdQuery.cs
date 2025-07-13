using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Queries.GetFuelByVehicleId
{
    public record GetFuelByVehicleIdQuery(
        Guid VehicleId,
        DateTime? From = null,
        DateTime? To = null
    ) : IRequest<List<FuelEntryDto>>;
}
