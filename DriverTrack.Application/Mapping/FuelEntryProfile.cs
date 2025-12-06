using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Mapping
{
    public class FuelEntryProfile : Profile
    {
        public FuelEntryProfile()
        {
            CreateMap<FuelEntry, FuelEntryDto>();
        }
    }
}
