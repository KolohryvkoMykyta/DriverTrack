namespace DriverTrack.Application.DTOs
{
    public class RouteTypeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public decimal Earnings { get; set; }
    }
}
