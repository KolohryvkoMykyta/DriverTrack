namespace DriverTrack.Application.DTOs
{
    public sealed class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;

        public DateTime ExpiresAtUtc { get; set; }

        public string Role { get; set; } = string.Empty;

        public Guid? DriverId { get; set; }
    }
}