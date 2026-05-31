using DriverTrack.Application.DTOs;
using DriverTrack.Application.Interfaces.Security;
using DriverTrack.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DriverTrack.Infrastructure.Auth
{
    public sealed class JwtTokenGenerator : IJwtTokenGenerator
    {
        private readonly IConfiguration _configuration;
        private readonly int _expirationHours;

        public JwtTokenGenerator(IConfiguration configuration)
        {
            _configuration = configuration;

            var expirationHoursValue = configuration["Jwt:ExpirationHours"];

            if (!int.TryParse(expirationHoursValue, out _expirationHours))
            {
                throw new InvalidOperationException(
                    "JWT ExpirationHours is not configured correctly.");
            }
        }

        public JwtTokenResult GenerateToken(UserAccount user)
        {
            var secretKey = _configuration["Jwt:SecretKey"]
                ?? throw new InvalidOperationException("JWT SecretKey is not configured.");

            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            if (user.DriverId.HasValue)
            {
                claims.Add(new Claim("driverId", user.DriverId.Value.ToString()));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddHours(_expirationHours);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expires,
                signingCredentials: credentials);

            var tokenHandler = new JwtSecurityTokenHandler();

            return new JwtTokenResult
            {
                Token = tokenHandler.WriteToken(token),
                ExpiresAtUtc = expires
            };
        }
    }
}