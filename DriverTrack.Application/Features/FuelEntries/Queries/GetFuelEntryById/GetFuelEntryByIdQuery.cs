using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Queries.GetFuelEntryById
{
    public record GetFuelEntryByIdQuery(Guid Id) : IRequest<FuelEntryDto?>;
}
