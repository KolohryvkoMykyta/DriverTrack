using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.FuelPrices.Queries.GetAllFuelPrices
{
    public sealed record GetAllFuelPricesQuery : IRequest<List<FuelPriceDto>>;
}