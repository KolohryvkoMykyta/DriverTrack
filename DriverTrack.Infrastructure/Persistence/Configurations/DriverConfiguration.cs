using DriverTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DriverTrack.Infrastructure.Persistence.Configurations
{
    public sealed class DriverConfiguration : IEntityTypeConfiguration<Driver>
    {
        public void Configure(EntityTypeBuilder<Driver> builder)
        {
            builder.HasKey(driver => driver.Id);

            builder.Property(driver => driver.Name)
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(driver => driver.PhoneNumber)
                .HasMaxLength(50);

            builder.Property(driver => driver.IsActive)
                .HasDefaultValue(true);

            builder.HasIndex(driver => driver.Name);
            builder.HasIndex(driver => driver.IsActive);
        }
    }
}
