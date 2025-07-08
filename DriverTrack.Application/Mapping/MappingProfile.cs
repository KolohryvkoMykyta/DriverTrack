using AutoMapper;
using DriverTrack.Application.DTOs;
using DriverTrack.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Driver, DriverDto>();
        }
    }
}
