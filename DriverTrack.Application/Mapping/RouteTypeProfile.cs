using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Mapping
{
    public class RouteTypeProfile : Profile
    {
        public RouteTypeProfile()
        {
            CreateMap<RouteType, RouteTypeDto>();
        }
    }
}
