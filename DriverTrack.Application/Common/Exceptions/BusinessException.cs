using static DriverTrack.Application.Common.Constants.ErrorMessages;

namespace DriverTrack.Application.Common.Exceptions
{
    public class BusinessException : Exception
    {
        public string Code { get; }
        public BusinessException(string code, string message) : base(message)
        {
            Code = code;
        }

        public BusinessException(ErrorMessage error)
        : base(error.Message)
        {
            Code = error.Code;
        }
    }
}
