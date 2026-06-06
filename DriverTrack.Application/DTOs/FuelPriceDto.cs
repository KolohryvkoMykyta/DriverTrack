namespace DriverTrack.Application.DTOs
{
    public class FuelPriceDto
    {
        public Guid Id { get; set; }

        public decimal PricePerLiter { get; set; }

        public DateTime EffectiveFrom { get; set; }
    }
}