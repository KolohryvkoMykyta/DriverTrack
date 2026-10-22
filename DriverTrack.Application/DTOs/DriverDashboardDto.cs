public sealed class DriverDashboardDto
{
    public int CompletedRouteCount { get; init; }

    public double TotalDistance { get; init; }

    public decimal TotalDriverPayment { get; init; }

    public List<DriverDashboardRouteDto> RecentRoutes { get; init; } = [];
}
