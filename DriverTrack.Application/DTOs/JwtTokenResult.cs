namespace DriverTrack.Application.DTOs
{
    public sealed class JwtTokenResult
    {
        public string Token { get; set; } = string.Empty;

        public DateTime ExpiresAtUtc { get; set; }
    }
}