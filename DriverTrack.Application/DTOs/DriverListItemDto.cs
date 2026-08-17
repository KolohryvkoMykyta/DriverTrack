namespace DriverTrack.Application.DTOs
{
    public class DriverListItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string PhoneNumber { get; set; } = default!;
        public bool IsActive { get; set; }

        public IReadOnlyCollection<DriverVehicleListItemDto> Vehicles { get; set; }
            = Array.Empty<DriverVehicleListItemDto>();
    }
}