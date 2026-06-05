namespace DriverTrack.Application.Common.Constants.ErrorMessages
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

        public static class Drivers
        {
            public static readonly ErrorMessage InvalidPhoneNumber =
                new("driver_invalid_phone_number", "Невірний номер телефону.");
        }

        public static class Auth
        {
            public static readonly ErrorMessage InvalidEmailOrPassword =
                new("invalid_email_or_password",
                    "Невірний email або пароль.");

            public static readonly ErrorMessage EmailAlreadyRegistered =
                new("email_already_registered",
                    "Email вже зареєстрований.");

            public static readonly ErrorMessage UserIsInactive =
                new("user_inactive",
                    "Користувач деактивований.");

            public static readonly ErrorMessage UserNotAuthorized =
                new("user_not_authorized",
                    "Користувач не авторизований.");
        }
    }
}
