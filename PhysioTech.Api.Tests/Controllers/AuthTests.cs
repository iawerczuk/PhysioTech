using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace PhysioTech.Api.Tests.Controllers;

public class AuthTests : IClassFixture<TestAppFactory>
{
    private readonly HttpClient _client;

    public AuthTests(TestAppFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_Should_Create_User()
    {
        var email = $"test{Guid.NewGuid()}@mail.com";

        var response = await _client.PostAsJsonAsync("/api/auth/register",
            new
            {
                email,
                password = "Test123!"
            });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }
}