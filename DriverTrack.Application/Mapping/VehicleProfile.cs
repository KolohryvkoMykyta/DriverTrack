using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Mapping
{
    public class VehicleProfile : Profile
    {
        public VehicleProfile()
        {
            CreateMap<Vehicle, VehicleDto>();
        }
    }
}
