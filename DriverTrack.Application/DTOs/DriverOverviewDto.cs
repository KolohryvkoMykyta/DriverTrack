namespace DriverTrack.Application.DTOs
{
    public class DriverOverviewDto
    {
        public Guid DriverId { get; set; }

        public string DriverName { get; set; } = string.Empty;

        public int RouteCount { get; set; }

        public decimal Revenue { get; set; }

        public decimal DriverPayment { get; set; }

        public decimal FuelCost { get; set; }

        public decimal NetProfit { get; set; }
    }
}