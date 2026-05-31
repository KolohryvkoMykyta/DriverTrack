using DriverTrack.Application.DTOs;
using DriverTrack.Domain.Entities;

namespace DriverTrack.Application.Interfaces.Security
{
    public interface IJwtTokenGenerator
    {
        JwtTokenResult GenerateToken(UserAccount user);
    }
}