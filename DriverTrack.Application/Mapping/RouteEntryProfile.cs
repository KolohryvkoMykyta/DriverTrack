using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Mapping
{
    public class RouteEntryProfile : Profile
    {
        public RouteEntryProfile()
        {
            CreateMap<RouteEntry, RouteEntryDto>();
        }
    }
}
