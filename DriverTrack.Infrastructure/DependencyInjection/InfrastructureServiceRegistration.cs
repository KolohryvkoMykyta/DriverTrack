using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.Interfaces.Persistence;
using DriverTrack.Application.Interfaces.Security;
using DriverTrack.Infrastructure.Auth;
using DriverTrack.Infrastructure.Persistence;
using DriverTrack.Infrastructure.Persistence.Repositories;
using DriverTrack.Infrastructure.Repositories;
using DriverTrack.Infrastructure.Security;
using DriverTrack.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DriverTrack.Infrastructure.DependencyInjection
{
    public static class InfrastructureServiceRegistration
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
        {
            services.AddDbContext<DriverTrackDbContext>(options =>
            {
                options.UseSqlite("Data Source=drivertrack.db");
            });

            services.AddScoped<IUnitOfWork, EfUnitOfWork>();

            services.AddScoped<IDriverRepository, DriverRepository>();
            services.AddScoped<IFuelEntryRepository, FuelEntryRepository>();
            services.AddScoped<IFuelPriceRepository, FuelPriceRepository>();
            services.AddScoped<IRouteRepository, RouteRepository>();
            services.AddScoped<IStatisticsRepository, StatisticsRepository>();
            services.AddScoped<IRouteTypeRepository, RouteTypeRepository>();
            services.AddScoped<IVehicleRepository, VehicleRepository>();

            services.AddScoped<IFuelConsumptionCalculator, FuelConsumptionCalculator>();
            services.AddScoped<IVehicleAverageConsumptionCalculator, VehicleAverageConsumptionCalculator>();
            services.AddScoped<IFuelCostCalculator, FuelCostCalculator>();
            services.AddScoped<IOverviewStatisticsBuilder, OverviewStatisticsBuilder>();

            services.AddScoped<IUserAccountRepository, UserAccountRepository>();
            services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();

            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

            services.AddSingleton<IPhoneNumberNormalizer, LibPhoneNumberNormalizer>();

            return services;
        }
    }
}
