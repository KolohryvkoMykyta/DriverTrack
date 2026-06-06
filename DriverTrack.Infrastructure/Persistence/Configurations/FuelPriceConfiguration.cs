using DriverTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DriverTrack.Infrastructure.Persistence.Configurations
{
    public sealed class FuelPriceConfiguration : IEntityTypeConfiguration<FuelPrice>
    {
        public void Configure(EntityTypeBuilder<FuelPrice> builder)
        {
            builder.HasKey(fuelPrice => fuelPrice.Id);

            builder.Property(fuelPrice => fuelPrice.PricePerLiter)
                .HasPrecision(18, 2)
                .IsRequired();

            builder.Property(fuelPrice => fuelPrice.EffectiveFrom)
                .IsRequired();

            builder.HasIndex(fuelPrice => fuelPrice.EffectiveFrom);
        }
    }
}