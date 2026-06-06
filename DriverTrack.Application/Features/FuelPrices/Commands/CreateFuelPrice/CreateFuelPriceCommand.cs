using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.FuelPrices.Commands.CreateFuelPrice
{
    public sealed record CreateFuelPriceCommand(
        decimal PricePerLiter,
        DateTime EffectiveFrom) : IRequest<FuelPriceDto>;
}