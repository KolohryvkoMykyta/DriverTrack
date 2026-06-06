namespace DriverTrack.Domain.Entities
{
    public class FuelPrice
    {
        public Guid Id { get; set; }

        public decimal PricePerLiter { get; set; }

        public DateTime EffectiveFrom { get; set; }
    }
}
