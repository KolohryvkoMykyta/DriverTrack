using MediatR;

namespace DriverTrack.Application.Features.FuelEntries.Commands.DeleteFuelEntry
{
    public record DeleteFuelEntryCommand(Guid Id) : IRequest<Unit>;
}
