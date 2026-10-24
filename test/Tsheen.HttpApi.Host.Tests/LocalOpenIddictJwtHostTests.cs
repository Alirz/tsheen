using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OpenIddict.Abstractions;
using Shouldly;
using Volo.Abp.Uow;
using Xunit;

namespace Tsheen;

[Collection(TsheenSsoHostCollection.Name)]
public class LocalOpenIddictJwtHostTests
{
    private const string UserInfoPath = "/connect/userinfo";
    private const string ProfilePath = "/api/account/my-profile";

    private readonly TsheenSsoHostFixture _fixture;

    public LocalOpenIddictJwtHostTests(TsheenSsoHostFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task Local_authority_issues_three_segment_signed_jwt_for_audience_Tsheen()
    {
        var token = await RequestAccessTokenAsync("openid profile email phone roles Tsheen offline_access");

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
        issuer.TrimEnd('/').ShouldNotBe(TsheenLocalJwtHostFactory.ApiSelfUrl);
        JwtTokenReader.AudienceValues(payload).ShouldContain(TsheenAuthServerHostFactory.Audience);
    }

    [Fact]
    public async Task Host_accepts_signed_jwt_for_audience_Tsheen_on_userinfo()
    {
        var token = await RequestAccessTokenAsync("openid profile email phone roles Tsheen offline_access");
        using var client = CreateAuthServerClient();
        using var request = new HttpRequestMessage(HttpMethod.Get, UserInfoPath);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        using var response = await client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();

        response.StatusCode.ShouldBe(HttpStatusCode.OK, body);
        using var document = JsonDocument.Parse(body);
        document.RootElement.GetProperty("preferred_username").GetString().ShouldBe("admin");
        document.RootElement.GetProperty("sub").GetString().ShouldNotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Host_rejects_missing_bearer_on_userinfo()
    {
        using var client = CreateAuthServerClient();

        using var response = await client.GetAsync(UserInfoPath);

        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
        response.StatusCode.ShouldNotBe(HttpStatusCode.OK);
        response.Headers.WwwAuthenticate.ToString().ShouldContain("Bearer");
    }

    [Fact]
    public async Task Host_accepts_signed_jwt_for_audience_Tsheen_on_my_profile()
    {
        var token = await RequestAccessTokenAsync("openid profile email phone roles Tsheen offline_access");
        var payload = JwtTokenReader.ReadSegment(JwtTokenReader.Segments(token)[1]);
        JwtTokenReader.AudienceValues(payload).ShouldContain(TsheenAuthServerHostFactory.Audience);
        payload.GetProperty("iss").GetString().ShouldNotBeNull().TrimEnd('/').ShouldBe(TsheenAuthServerHostFactory.Issuer);

        var configuration = _fixture.Api.Services.GetRequiredService<IConfiguration>();
        configuration["AuthServer:Authority"].ShouldBe(TsheenAuthServerHostFactory.Issuer);
        configuration["App:SelfUrl"].ShouldBe(TsheenLocalJwtHostFactory.ApiSelfUrl);

        using var client = CreateApiClient();
        using var request = new HttpRequestMessage(HttpMethod.Get, ProfilePath);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        using var response = await client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();

        response.StatusCode.ShouldBe(HttpStatusCode.OK, response.Headers.WwwAuthenticate + " " + body);
        using var document = JsonDocument.Parse(body);
        document.RootElement.GetProperty("userName").GetString().ShouldBe("admin");
        document.RootElement.GetProperty("email").GetString().ShouldBe(TsheenConsts.AdminEmailDefaultValue);
    }

    [Fact]
    public async Task Host_rejects_jwt_that_omits_audience_Tsheen_on_my_profile()
    {
        var token = await RequestAccessTokenAsync("openid profile email phone roles");
        var payload = JwtTokenReader.ReadSegment(JwtTokenReader.Segments(token)[1]);
        payload.TryGetProperty("aud", out _).ShouldBeFalse();

        using var client = CreateApiClient();
        using var request = new HttpRequestMessage(HttpMethod.Get, ProfilePath);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        using var response = await client.SendAsync(request);

        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
        response.StatusCode.ShouldNotBe(HttpStatusCode.OK);
        response.Headers.WwwAuthenticate.ToString().ShouldContain("Bearer");
    }

    [Fact]
    public async Task Host_rejects_invalid_bearer_on_userinfo()
    {
        using var client = CreateAuthServerClient();
        using var request = new HttpRequestMessage(HttpMethod.Get, UserInfoPath);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", JwtTokenReader.InvalidSignedJwt());

        using var response = await client.SendAsync(request);

        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
        response.StatusCode.ShouldNotBe(HttpStatusCode.OK);
        response.Headers.WwwAuthenticate.ToString().ShouldContain("Bearer");
    }

    [Fact]
    public async Task Api_rejects_missing_bearer_on_my_profile()
    {
        using var client = CreateApiClient();

        using var response = await client.GetAsync(ProfilePath);

        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
        response.StatusCode.ShouldNotBe(HttpStatusCode.OK);
        response.Headers.WwwAuthenticate.ToString().ShouldContain("Bearer");
    }

    [Fact]
    public async Task Api_rejects_invalid_bearer_on_my_profile()
    {
        using var client = CreateApiClient();
        using var request = new HttpRequestMessage(HttpMethod.Get, ProfilePath);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", JwtTokenReader.InvalidSignedJwt());

        using var response = await client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();

        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized, body);
        response.StatusCode.ShouldNotBe(HttpStatusCode.OK);
        response.Headers.WwwAuthenticate.ToString().ShouldContain("Bearer");
    }

    [Fact]
    public async Task Api_host_does_not_issue_access_tokens()
    {
        using var client = CreateApiClient();
        using var content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["grant_type"] = OpenIddictConstants.GrantTypes.Password,
            ["username"] = "admin",
            ["password"] = TsheenConsts.AdminPasswordDefaultValue,
            ["client_id"] = TsheenAuthServerHostFactory.AppClientId,
            ["scope"] = "openid Tsheen",
        });

        using var response = await client.PostAsync("/connect/token", content);
        var body = await response.Content.ReadAsStringAsync();

        response.StatusCode.ShouldNotBe(HttpStatusCode.OK);
        body.ShouldNotContain("access_token");
    }

    [Fact]
    public async Task Seeded_Tsheen_App_keeps_authorization_code_at_localhost_3000()
    {
        await using var scope = _fixture.AuthServer.Services.CreateAsyncScope();
        var unitOfWorkManager = scope.ServiceProvider.GetRequiredService<IUnitOfWorkManager>();
        using var unitOfWork = unitOfWorkManager.Begin(requiresNew: true);
        var manager = scope.ServiceProvider.GetRequiredService<IOpenIddictApplicationManager>();

        var clientIds = new List<string>();
        await foreach (var application in manager.ListAsync())
        {
            clientIds.Add((await manager.GetClientIdAsync(application))!);
        }

        clientIds.Sort(StringComparer.Ordinal);
        clientIds.ShouldBe(new[]
        {
            TsheenAuthServerHostFactory.AppClientId,
            TsheenAuthServerHostFactory.SwaggerClientId,
        });

        var app = await manager.FindByClientIdAsync(TsheenAuthServerHostFactory.AppClientId);
        app.ShouldNotBeNull();
        (await manager.GetClientTypeAsync(app)).ShouldBe(OpenIddictConstants.ClientTypes.Public);
        (await manager.GetRedirectUrisAsync(app)).ShouldContain(TsheenAuthServerHostFactory.AppRootUrl);
        (await manager.GetPermissionsAsync(app)).ShouldContain(OpenIddictConstants.Permissions.GrantTypes.AuthorizationCode);

        await unitOfWork.CompleteAsync();
    }

    private HttpClient CreateAuthServerClient()
    {
        return _fixture.AuthServer.CreateClient(new Microsoft.AspNetCore.Mvc.Testing.WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
        });
    }

    private HttpClient CreateApiClient()
    {
        return _fixture.Api.CreateClient();
    }

    private async Task<string> RequestAccessTokenAsync(string scope)
    {
        using var client = CreateAuthServerClient();
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
