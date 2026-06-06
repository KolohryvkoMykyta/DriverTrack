using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.FuelPrices.Commands.UpdateFuelPrice
{
    public sealed record UpdateFuelPriceCommand(
        Guid Id,
        decimal PricePerLiter,
        DateTime EffectiveFrom) : IRequest<FuelPriceDto>;
}