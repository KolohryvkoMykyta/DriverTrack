using MediatR;

namespace DriverTrack.Application.Features.Drivers.Commands.Create
{
    public record CreateDriverCommand(string Name, string PhoneNumber) : IRequest<Guid>;
}
