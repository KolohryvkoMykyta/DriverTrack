namespace DriverTrack.Domain.Entities;

public class RouteType
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public decimal DriverPayment { get; set; }
    public decimal Revenue { get; set; }

    public ICollection<RouteEntry> RouteEntries { get; set; } = new List<RouteEntry>();
}