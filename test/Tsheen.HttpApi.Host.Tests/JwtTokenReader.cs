using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;

namespace Tsheen;

internal static class JwtTokenReader
{
    public static string[] Segments(string token)
    {
        return token.Split('.');
    }

    public static IEnumerable<string> AudienceValues(JsonElement payload)
    {
        var audience = payload.GetProperty("aud");
        if (audience.ValueKind == JsonValueKind.Array)
        {
            return audience.EnumerateArray().Select(item => item.GetString()!).ToArray();
        }

        return new[] { audience.GetString()! };
    }

    public static JsonElement ReadSegment(string segment)
    {
        using var document = JsonDocument.Parse(Encoding.UTF8.GetString(Base64UrlDecode(segment)));
        return document.RootElement.Clone();
    }

    public static string InvalidSignedJwt()
    {
        return string.Join('.',
            Base64Url("{\"alg\":\"RS256\",\"typ\":\"JWT\"}"),
            Base64Url("{\"iss\":\"https://localhost:44366\",\"aud\":\"Tsheen\",\"sub\":\"invalid\"}"),
            Base64Url("invalid-signature"));
    }

    private static string Base64Url(string value)
    {
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(value))
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }

    private static byte[] Base64UrlDecode(string segment)
    {
        var padded = segment.Replace('-', '+').Replace('_', '/');
        switch (padded.Length % 4)
        {
            case 2:
                padded += "==";
                break;
            case 3:
                padded += "=";
                break;
        }

        return Convert.FromBase64String(padded);
    }
}
