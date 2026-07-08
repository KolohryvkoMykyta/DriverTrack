using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Queries.GetFuelEntries
{
    public record GetFuelEntriesQuery(
        Guid? DriverId, 
        Guid? VehicleId, 
        DateTime? StartDate, 
        DateTime? EndDate) : IRequest<List<FuelEntryDto>>;
}
