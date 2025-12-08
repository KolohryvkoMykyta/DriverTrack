using DriverTrack.Application.Common.Exceptions;
using DriverTrack.WebAPI.Common;
using System.Net;
using System.Text.Json;

namespace DriverTrack.WebAPI.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            _logger.LogError(exception, "Unhandled exception");

            var response = context.Response;
            response.ContentType = "application/json";

            HttpStatusCode statusCode;
            ApiErrorResponse error;

            switch (exception)
            {
                case NotFoundException notFoundEx:
                    statusCode = HttpStatusCode.NotFound;
                    error = new ApiErrorResponse("not_found", notFoundEx.Message);
                    break;

                case BusinessException businessEx:
                    statusCode = HttpStatusCode.BadRequest;
                    error = new ApiErrorResponse(businessEx.Code, businessEx.Message);
                    break;

                default:
                    statusCode = HttpStatusCode.InternalServerError;
                    error = new ApiErrorResponse("internal_error", "An unexpected error occurred.");
                    break;
            }

            response.StatusCode = (int)statusCode;

            var json = JsonSerializer.Serialize(error);
            await response.WriteAsync(json);
        }
    }
}
