namespace DriverTrack.Application.DTOs
{
    public class RouteDetailsDto : RouteEntryDto
    {
        public decimal? FuelCost { get; set; }

        public decimal? NetProfit { get; set; }
    }
}