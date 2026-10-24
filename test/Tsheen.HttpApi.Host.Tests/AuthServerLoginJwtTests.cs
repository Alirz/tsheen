using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using OpenIddict.Abstractions;
using Shouldly;
using Xunit;

namespace Tsheen;

[Collection(TsheenSsoHostCollection.Name)]
public class AuthServerLoginJwtTests
{
    private readonly TsheenSsoHostFixture _fixture;

    public AuthServerLoginJwtTests(TsheenSsoHostFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task AuthServer_serves_account_login_and_issues_three_segment_jwt_for_audience_Tsheen()
    {
        using var client = CreateClient();
        using var loginResponse = await client.GetAsync("/Account/Login");
        var loginBody = await loginResponse.Content.ReadAsStringAsync();

        loginResponse.StatusCode.ShouldBe(HttpStatusCode.OK, loginBody);
        loginResponse.Content.Headers.ContentType?.MediaType.ShouldBe("text/html");
        loginBody.ShouldContain("LoginInput.UserNameOrEmailAddress");
        loginBody.ShouldContain("LoginInput.Password");
        loginResponse.RequestMessage!.RequestUri!.AbsolutePath.ShouldBe("/Account/Login");

        var token = await RequestAccessTokenAsync(client, "openid profile email phone roles Tsheen offline_access");
        var segments = JwtTokenReader.Segments(token);
        segments.Length.ShouldBe(3);
        segments.ShouldAllBe(segment => !string.IsNullOrWhiteSpace(segment));

        var header = JwtTokenReader.ReadSegment(segments[0]);
        header.TryGetProperty("enc", out _).ShouldBeFalse();
        var algorithm = header.GetProperty("alg").GetString();
        algorithm.ShouldNotBeNullOrWhiteSpace();
        algorithm.ShouldNotBe("none");

        var payload = JwtTokenReader.ReadSegment(segments[1]);
        var issuer = payload.GetProperty("iss").GetString();
        issuer.ShouldNotBeNull();
        issuer.TrimEnd('/').ShouldBe(TsheenAuthServerHostFactory.Issuer);
        issuer.TrimEnd('/').ShouldNotBe(TsheenAuthServerHostFactory.ApiSelfUrl);
        JwtTokenReader.AudienceValues(payload).ShouldContain(TsheenAuthServerHostFactory.Audience);

        _fixture.AuthServer.Services.GetRequiredService<Microsoft.Extensions.Hosting.IHostEnvironment>()
            .ApplicationName.ShouldBe("Tsheen.AuthServer");
        _fixture.Api.Services.GetRequiredService<Microsoft.Extensions.Hosting.IHostEnvironment>()
            .ApplicationName.ShouldBe("Tsheen.HttpApi.Host");
    }

    private HttpClient CreateClient()
    {
        return _fixture.AuthServer.CreateClient(new Microsoft.AspNetCore.Mvc.Testing.WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = true,
        });
    }

    private static async Task<string> RequestAccessTokenAsync(HttpClient client, string scope)
    {
        using var content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["grant_type"] = OpenIddictConstants.GrantTypes.Password,
            ["username"] = "admin",
            ["password"] = TsheenConsts.AdminPasswordDefaultValue,
            ["client_id"] = TsheenAuthServerHostFactory.AppClientId,
            ["scope"] = scope,
        });

        using var response = await client.PostAsync("/connect/token", content);
        var body = await response.Content.ReadAsStringAsync();
        response.StatusCode.ShouldBe(HttpStatusCode.OK, body);

        using var document = JsonDocument.Parse(body);
        document.RootElement.GetProperty("token_type").GetString().ShouldBe("Bearer");
        var accessToken = document.RootElement.GetProperty("access_token").GetString();
        accessToken.ShouldNotBeNullOrWhiteSpace();
        return accessToken;
    }
}
