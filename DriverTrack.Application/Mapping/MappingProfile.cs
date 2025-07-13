using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Driver, DriverDto>();
            CreateMap<RouteEntry, RouteEntryDto>();
            CreateMap<Vehicle, VehicleDto>();
            CreateMap<RouteType, RouteTypeDto>();
        }
    }
}