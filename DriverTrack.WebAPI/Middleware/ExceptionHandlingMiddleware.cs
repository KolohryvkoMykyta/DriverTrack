using DriverTrack.Application.Common.Exceptions;
using DriverTrack.WebAPI.Common;
using FluentValidation;
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
                    _logger.LogWarning(exception, "Business exception occurred");
                    break;

                case ValidationException validationEx:
                    statusCode = HttpStatusCode.BadRequest;

                    var errors = validationEx.Errors
                        .GroupBy(e => e.PropertyName)
                        .ToDictionary(
                            g => g.Key,
                            g => g.Select(e => e.ErrorMessage).Distinct().ToArray());

                    error = new ApiErrorResponse("validation_error", "Validation failed.", errors);
                    break;

                default:
                    statusCode = HttpStatusCode.InternalServerError;
                    error = new ApiErrorResponse("internal_error", "An unexpected error occurred.");
                    _logger.LogError(exception, "Unhandled exception");
                    break;
            }

            response.StatusCode = (int)statusCode;

            var json = JsonSerializer.Serialize(error);
            await response.WriteAsync(json);
        }
    }
}
