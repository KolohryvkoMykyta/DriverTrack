namespace DriverTrack.Application.Common.Interfaces
{
    public interface IPhoneNumberNormalizer
    {
        string NormalizeToE164(string raw);
    }
}
