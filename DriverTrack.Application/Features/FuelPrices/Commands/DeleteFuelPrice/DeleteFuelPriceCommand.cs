using MediatR;

namespace DriverTrack.Application.Features.FuelPrices.Commands.DeleteFuelPrice
{
    public sealed record DeleteFuelPriceCommand(Guid Id) : IRequest;
}