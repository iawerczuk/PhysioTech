using System.Net.Http.Json;
using System.Text.Json.Serialization;

namespace PhysioTech.Api.Tests.Helpers;

public static class TestAuthHelper
{
    public static async Task<string> RegisterAndLoginAsync(HttpClient client)
    {
        var email = $"test_{Guid.NewGuid():N}@example.com";
        var password = "Test1234!";

        // REGISTER
        var reg = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email,
            password
        });

        reg.EnsureSuccessStatusCode();

        // LOGIN
        var login = await client.PostAsJsonAsync("/api/auth/login", new
        {
            email,
            password
        });

        login.EnsureSuccessStatusCode();

        var payload = await login.Content.ReadFromJsonAsync<LoginResponse>();

        if (payload?.AccessToken is null)
            throw new Exception("Brak accessToken w odpowiedzi login.");

        return payload.AccessToken;
    }

    private sealed class LoginResponse
    {
        [JsonPropertyName("accessToken")]
        public string? AccessToken { get; set; }
    }
}