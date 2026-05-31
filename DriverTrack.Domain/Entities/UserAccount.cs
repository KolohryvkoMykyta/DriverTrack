using DriverTrack.Domain.Enums;

namespace DriverTrack.Domain.Entities
{
    public sealed class UserAccount
    {
        public Guid Id { get; set; }

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public UserRole Role { get; set; }

        public Guid? DriverId { get; set; }

        public Driver? Driver { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
