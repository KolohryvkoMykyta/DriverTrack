namespace DriverTrack.WebAPI.Common
{
    public sealed class ApiErrorResponse
    {
        public string Code { get; init; }
        public string Message { get; init; }
        public Dictionary<string, string[]>? Errors { get; }

        public ApiErrorResponse(string code, string message, Dictionary<string, string[]>? errors = null)
        {
            Code = code;
            Message = message;
            Errors = errors;
        }
    }
}
