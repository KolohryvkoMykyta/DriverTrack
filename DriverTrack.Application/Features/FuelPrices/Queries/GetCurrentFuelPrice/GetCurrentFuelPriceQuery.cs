using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.FuelPrices.Queries.GetCurrentFuelPrice
{
    public sealed record GetCurrentFuelPriceQuery(DateTime Date) : IRequest<FuelPriceDto?>;
}