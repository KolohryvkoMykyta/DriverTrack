using static DriverTrack.Application.Common.Constants.ErrorMessages.ErrorMessages;

namespace DriverTrack.Application.Common.Exceptions;

public sealed class ForbiddenException : Exception
{
    public string Code { get; }

    public ForbiddenException(ErrorMessage error)
        : base(error.Message)
    {
        Code = error.Code;
    }
}