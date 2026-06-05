using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.Vehicles.Queries.GetAllVehicles
{
    public record GetAllVehiclesQuery() : IRequest<List<VehicleDto>>;
}
