namespace DriverTrack.Application.DTOs
{
    public class DriverDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string PhoneNumber { get; set; } = default!;
        public bool IsActive { get; set; }
    }
}
