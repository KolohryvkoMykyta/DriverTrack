namespace DriverTrack.Application.Common.Constants
{
    public static class ErrorMessages
    {
        public sealed record ErrorMessage(string Code, string Message);
        public static class Route
        {
            public static readonly ErrorMessage OpenAlreadyExists =
                new("route_open_already_exists",
                    "У вас уже є відкритий маршрут. Будь ласка, закрийте його перед створенням нового.");

            public static readonly ErrorMessage AlreadyClosed =
                new("route_already_closed",
                    "Цей маршрут уже закрито.");
        }

        public static class Filters
        {
            public static readonly ErrorMessage OnlyOneFilterAllowed =
                new("only_one_filter_allowed",
                    "Можна вказати лише один фільтр: або driverId, або vehicleId.");

            public static readonly ErrorMessage DriverOrVehicleRequired =
                new("driver_or_vehicle_required",
                    "Необхідно вказати driverId або vehicleId.");
        }

        public static class FuelEntries
        {
            public static ErrorMessage DriverNotFoundById(Guid id) =>
                new("driver_not_found",
                    $"Водія з id '{id}' не знайдено.");

            public static ErrorMessage VehicleNotFoundById(Guid id) =>
                new("vehicle_not_found",
                    $"Автомобіль з id '{id}' не знайдено.");
        }
    }
}
