using DriverTrack.Application.DTOs;
using MediatR;

namespace DriverTrack.Application.Features.Vehicles.Queries.GetVehiclesByDriver
{
    public record GetVehiclesByDriverQuery(Guid DriverId) : IRequest<List<VehicleDto>>;
}
