namespace DriverTrack.Application.Common.Constants
{
    public static class ErrorMessages
    {
        // ---- ROUTE ERRORS ----
        public const string RouteOpenAlreadyExists = "У вас уже є відкритий маршрут. Будь ласка, закрийте його перед створенням нового.";
        public const string RouteAlreadyClosed = "Цей маршрут уже закрито.";
        
        // ---- FILTER ERRORS ----
        public const string OnlyOneFilterAllowed = "Можна вказати лише один фільтр: або driverId, або vehicleId.";
        public const string DriverOrVehicleRequired = "Необхідно вказати driverId або vehicleId.";
    }
}
