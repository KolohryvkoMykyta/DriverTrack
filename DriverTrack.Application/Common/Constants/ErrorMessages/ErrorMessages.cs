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

            public static readonly ErrorMessage AccessDenied =
                new("route_access_denied",
                    "Ви не маєте доступу до цього маршруту.");

            public static readonly ErrorMessage EndOdometerBeforeStart =
                new("route_end_odometer_before_start",
                    "Кінцевий показник одометра не може бути меншим за початковий.");

            public static readonly ErrorMessage EndDateBeforeStart =
                new("route_end_date_before_start",
                    "Дата завершення не може бути раніше дати початку.");
        }

        public static class Filters
        {
            public static readonly ErrorMessage OnlyOneFilterAllowed =
                new("only_one_filter_allowed",
                    "Можна вказати лише один фільтр: або driverId, або vehicleId.");

            public static readonly ErrorMessage DriverOrVehicleRequired =
                new("driver_or_vehicle_required",
                    "Необхідно вказати driverId або vehicleId.");

            public static readonly ErrorMessage InvalidPeriod =
                new("invalid_period",
                    "Кінець періоду повинен бути пізніше його початку.");

            public static readonly ErrorMessage UtcPeriodRequired =
                new("utc_period_required",
                    "Межі періоду потрібно передавати у форматі UTC із суфіксом Z.");
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

            public static readonly ErrorMessage InactiveOrUnavailable =
                new("driver_inactive",
                    "Профіль водія недоступний або деактивований.");
        }

        public static class Vehicles
        {
            public static readonly ErrorMessage AccessDenied =
                new("vehicle_access_denied",
                    "Цей автомобіль вам недоступний.");

            public static readonly ErrorMessage Inactive =
                new("vehicle_inactive",
                    "Неможливо розпочати маршрут на неактивному автомобілі.");
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

            public static readonly ErrorMessage DriverProfileRequired =
                new("driver_profile_required",
                    "Обліковий запис не пов'язаний із водієм.");
        }
    }
}
