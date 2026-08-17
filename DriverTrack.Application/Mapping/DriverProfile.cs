using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Mapping
{
    public class DriverProfile : Profile
    {
        public DriverProfile()
        {
            CreateMap<Driver, DriverDto>();

            CreateMap<Vehicle, DriverVehicleListItemDto>();

            CreateMap<Driver, DriverListItemDto>()
                .ForMember(
                    destination => destination.Vehicles,
                    options => options.MapFrom(
                        source => source.Vehicles
                            .Where(vehicle => vehicle.IsActive)));
        }
    }
}
