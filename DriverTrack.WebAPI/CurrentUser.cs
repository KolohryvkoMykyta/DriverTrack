using System.Security.Claims;
using DriverTrack.Application.Interfaces.Security;
using DriverTrack.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace DriverTrack.WebAPI.Security;

public sealed class CurrentUser : ICurrentUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User =>
        _httpContextAccessor.HttpContext?.User;

    public bool IsAuthenticated =>
        User?.Identity?.IsAuthenticated == true;

    public Guid? UserId =>
        GetGuidClaim(ClaimTypes.NameIdentifier);

    public Guid? DriverId =>
        GetGuidClaim("driverId");

    public bool IsAdmin =>
        IsAuthenticated &&
        User?.IsInRole(nameof(UserRole.Admin)) == true;

    public bool IsDriver =>
        IsAuthenticated &&
        User?.IsInRole(nameof(UserRole.Driver)) == true;

    private Guid? GetGuidClaim(string claimType)
    {
        if (!IsAuthenticated)
        {
            return null;
        }

        var value = User?.FindFirstValue(claimType);

        return Guid.TryParse(value, out var id) && id != Guid.Empty
            ? id
            : null;
    }
}