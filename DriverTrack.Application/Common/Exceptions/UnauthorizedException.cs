using static DriverTrack.Application.Common.Constants.ErrorMessages.ErrorMessages;

namespace DriverTrack.Application.Common.Exceptions
{
    public class UnauthorizedException : Exception
    {
        public string Code { get; }

        public UnauthorizedException(string code, string message)
            : base(message)
        {
            Code = code;
        }

        public UnauthorizedException(ErrorMessage error)
            : base(error.Message)
        {
            Code = error.Code;
        }
    }
}