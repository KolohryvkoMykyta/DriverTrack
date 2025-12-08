namespace DriverTrack.WebAPI.Common
{
    public sealed class ApiErrorResponse
    {
        public string Code { get; init; }
        public string Message { get; init; }

        public ApiErrorResponse(string code, string message)
        {
            Code = code;
            Message = message;
        }
    }
}
