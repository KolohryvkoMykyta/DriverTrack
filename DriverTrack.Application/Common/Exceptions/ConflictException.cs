using static DriverTrack.Application.Common.Constants.ErrorMessages.ErrorMessages;

namespace DriverTrack.Application.Common.Exceptions
{
    public class ConflictException : Exception
    {
        public string Code { get; }

        public ConflictException(string code, string message)
            : base(message)
        {
            Code = code;
        }

        public ConflictException(ErrorMessage error)
            : base(error.Message)
        {
            Code = error.Code;
        }
    }
}