using DriverTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DriverTrack.Infrastructure.Persistence.Configurations
{
    public sealed class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
    {
        public void Configure(EntityTypeBuilder<Vehicle> builder)
        {
            builder.HasKey(vehicle => vehicle.Id);

            builder.Property(vehicle => vehicle.Brand)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(vehicle => vehicle.Model)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(vehicle => vehicle.LicensePlate)
                .HasMaxLength(32)
                .IsRequired();

            builder.Property(vehicle => vehicle.IsActive)
                .HasDefaultValue(true);

            builder.HasOne(vehicle => vehicle.Driver)
                .WithMany(driver => driver.Vehicles)
                .HasForeignKey(vehicle => vehicle.DriverId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(vehicle => vehicle.DriverId);
            builder.HasIndex(vehicle => vehicle.LicensePlate).IsUnique();
            builder.HasIndex(vehicle => new { vehicle.Brand, vehicle.Model });
        }
    }
}
