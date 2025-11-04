using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Application.Interfaces;
using DriverTrack.Infrastructure.Persistence;
using DriverTrack.Infrastructure.Repositories;
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
            services.AddScoped<IRouteRepository, RouteRepository>();
            services.AddScoped<IRouteTypeRepository, RouteTypeRepository>();
            services.AddScoped<IVehicleRepository, VehicleRepository>();

            services.AddScoped<IFuelConsumptionCalculator, FuelConsumptionCalculator>();
            services.AddScoped<IVehicleAverageConsumptionCalculator, VehicleAverageConsumptionCalculator>();

            return services;
        }
    }
}
