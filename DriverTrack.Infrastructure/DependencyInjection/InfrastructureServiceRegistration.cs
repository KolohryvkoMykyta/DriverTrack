using DriverTrack.Application.Common.Interfaces;
using DriverTrack.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace DriverTrack.Infrastructure.DependencyInjection
{
    public static class InfrastructureServiceRegistration
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
        {
            services.AddScoped<IConsumptionCalculator, ConsumptionCalculator>();

            return services;
        }
    }
}
