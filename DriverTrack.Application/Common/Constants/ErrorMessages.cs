using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTrack.Application.Common.Constants
{
    public static class ErrorMessages
    {
        public const string OpenRouteExists = "У вас уже є відкритий маршрут. Будь ласка, закрийте його перед створенням нового.";
        public const string RouteAlreadyClosed = "Цей маршрут уже закрито.";
    }
}
