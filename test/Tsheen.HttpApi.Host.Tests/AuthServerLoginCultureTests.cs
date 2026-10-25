using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Shouldly;
using Xunit;

namespace Tsheen.HttpApi.Host.Tests;

[Collection(global::Tsheen.TsheenSsoHostCollection.Name)]
public class AuthServerLoginCultureTests
{
    private const string PersianWelcome = "به تیشین خوش آمدید.";
    private const string PersianUserNameOrEmailAddress = "نام کاربری (کدملی)";
    private const string PersianPassword = "رمز ورود";
    private const string PersianSubmit = "ورود به تیشین";
    private const string OldEnglishUserNameOrEmailAddress = "Username or email address";
    private const string EnglishUserNameOrEmailAddress = "Username (national ID)";
    private const string ButtonGold = "#cc8627";
    private const string ActiveTabGold = "#eac880";
    private const string ForgotLinkBlue = "#0077ff";

    private readonly global::Tsheen.TsheenSsoHostFixture _fixture;

    public AuthServerLoginCultureTests(global::Tsheen.TsheenSsoHostFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task Account_login_without_culture_cookie_or_query_is_persian_figma_html_and_english_query_uses_english()
    {
        using var client = CreateClient();

        using var defaultRequest = new HttpRequestMessage(HttpMethod.Get, "/Account/Login");
        defaultRequest.Headers.Contains("Cookie").ShouldBeFalse();

        using var defaultResponse = await client.SendAsync(defaultRequest);
        var defaultBody = await defaultResponse.Content.ReadAsStringAsync();
        var defaultUri = defaultResponse.RequestMessage!.RequestUri!;

        defaultUri.AbsolutePath.ShouldBe("/Account/Login");
        defaultUri.Query.Contains("culture", StringComparison.OrdinalIgnoreCase).ShouldBeFalse();
        CookieHeader(defaultResponse).ShouldNotContain(".AspNetCore.Culture");

        defaultResponse.StatusCode.ShouldBe(HttpStatusCode.OK, defaultBody);
        defaultResponse.Content.Headers.ContentType?.MediaType.ShouldBe("text/html");
        defaultBody.ShouldContain("lang=\"fa\"");
        defaultBody.ShouldContain("dir=\"rtl\"");
        defaultBody.ShouldContain(PersianWelcome);
        defaultBody.ShouldContain("placeholder=\"" + PersianUserNameOrEmailAddress + "\"");
        defaultBody.ShouldContain("placeholder=\"" + PersianPassword + "\"");
        defaultBody.ShouldContain(PersianSubmit);
        defaultBody.ShouldContain(ButtonGold);
        defaultBody.ShouldContain(ActiveTabGold);
        defaultBody.ShouldContain(ForgotLinkBlue);
        defaultBody.ShouldContain("LoginInput.UserNameOrEmailAddress");
        defaultBody.ShouldContain("LoginInput.Password");
        defaultBody.ShouldContain("<span class=\"field-error field-error-user\"><span class=\"field-validation-valid text-danger\" data-valmsg-for=\"LoginInput.UserNameOrEmailAddress\" data-valmsg-replace=\"true\"></span></span>");
        defaultBody.ShouldContain("<span class=\"field-error field-error-pass\"><span class=\"field-validation-valid text-danger\" data-valmsg-for=\"LoginInput.Password\" data-valmsg-replace=\"true\"></span></span>");
        defaultBody.ShouldNotContain(OldEnglishUserNameOrEmailAddress);
        defaultBody.ShouldNotContain(EnglishUserNameOrEmailAddress);

        using var englishRequest = new HttpRequestMessage(HttpMethod.Get, "/Account/Login?culture=en&ui-culture=en");
        using var englishResponse = await client.SendAsync(englishRequest);
        var englishBody = await englishResponse.Content.ReadAsStringAsync();
        var englishQuery = englishResponse.RequestMessage!.RequestUri!.Query;

        englishResponse.StatusCode.ShouldBe(HttpStatusCode.OK, englishBody);
        englishResponse.Content.Headers.ContentType?.MediaType.ShouldBe("text/html");
        englishQuery.ShouldContain("culture=en");
        englishQuery.ShouldContain("ui-culture=en");
        englishBody.ShouldContain("lang=\"en\"");
        englishBody.ShouldContain("dir=\"rtl\"");
        englishBody.ShouldContain("placeholder=\"" + EnglishUserNameOrEmailAddress + "\"");
        englishBody.ShouldContain(ButtonGold);
        englishBody.ShouldContain(ActiveTabGold);
        englishBody.ShouldContain(ForgotLinkBlue);
        englishBody.ShouldContain("LoginInput.UserNameOrEmailAddress");
        englishBody.ShouldContain("LoginInput.Password");
        englishBody.ShouldContain("<span class=\"field-error field-error-user\"><span class=\"field-validation-valid text-danger\" data-valmsg-for=\"LoginInput.UserNameOrEmailAddress\" data-valmsg-replace=\"true\"></span></span>");
        englishBody.ShouldContain("<span class=\"field-error field-error-pass\"><span class=\"field-validation-valid text-danger\" data-valmsg-for=\"LoginInput.Password\" data-valmsg-replace=\"true\"></span></span>");
        englishBody.ShouldNotContain(PersianWelcome);
        englishBody.ShouldNotContain(PersianUserNameOrEmailAddress);
        englishBody.ShouldNotContain(PersianSubmit);
    }

    private static string CookieHeader(HttpResponseMessage response)
    {
        if (response.RequestMessage?.Headers.TryGetValues("Cookie", out var values) != true || values == null)
        {
            return string.Empty;
        }

        return string.Join("; ", values);
    }

    private HttpClient CreateClient()
    {
        return _fixture.AuthServer.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = true,
        });
    }
}
