using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Mapping
{
    public class FuelPriceProfile : Profile
    {
        public FuelPriceProfile()
        {
            CreateMap<FuelPrice, FuelPriceDto>();
        }
    }
}