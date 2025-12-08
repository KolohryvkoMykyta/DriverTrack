using System;

namespace DriverTrack.Application.Common.Exceptions;

public class NotFoundException : Exception
{
    public string Name { get; }
    public object Key { get; }

    public NotFoundException(string name, object key)
        : base($"{name} with key '{key}' was not found.")
    {
        Name = name;
        Key = key;
    }
}