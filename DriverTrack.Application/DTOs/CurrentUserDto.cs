namespace DriverTrack.Application.DTOs;

public sealed class CurrentUserDto
{
    public Guid Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    public Guid? DriverId { get; set; }

    public string DisplayName { get; set; } = string.Empty;
}