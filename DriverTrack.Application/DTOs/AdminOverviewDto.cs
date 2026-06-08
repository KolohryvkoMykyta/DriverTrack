namespace DriverTrack.Application.DTOs
{
    public class AdminOverviewDto
    {
        public decimal TotalRevenue { get; set; }

        public decimal TotalDriverPayment { get; set; }

        public decimal TotalFuelCost { get; set; }

        public decimal NetProfit { get; set; }

        public int RouteCount { get; set; }

        public double TotalDistance { get; set; }

        public double TotalFuelLiters { get; set; }

        public double? AverageFuelConsumption { get; set; }

        public FuelPriceDto? CurrentFuelPrice { get; set; }

        public List<DriverOverviewDto> Drivers { get; set; } = [];

        public List<VehicleOverviewDto> Vehicles { get; set; } = [];
    }
}