using DriverTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DriverTrack.Infrastructure.Persistence.Configurations
{
    public sealed class UserAccountConfiguration : IEntityTypeConfiguration<UserAccount>
    {
        public void Configure(EntityTypeBuilder<UserAccount> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(256);

            builder.Property(x => x.PasswordHash)
                .IsRequired();

            builder.Property(x => x.Role)
                .IsRequired();

            builder.Property(x => x.IsActive)
                .IsRequired();

            builder.HasIndex(x => x.Email)
                .IsUnique();

            builder.HasOne(x => x.Driver)
                .WithOne()
                .HasForeignKey<UserAccount>(x => x.DriverId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}