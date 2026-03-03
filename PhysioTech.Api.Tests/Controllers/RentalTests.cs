using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using PhysioTech.Api.Data;
using PhysioTech.Api.Tests.Helpers;
using Xunit;

namespace PhysioTech.Api.Tests.Controllers;

public class RentalTests : IClassFixture<TestAppFactory>
{
    private readonly TestAppFactory _factory;

    public RentalTests(TestAppFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Get_MyRentals_WithoutToken_ShouldReturn401()
    {
        var client = _factory.CreateClient();

        var res = await client.GetAsync("/api/rentals/my");

        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }

    [Fact]
    public async Task CreateRental_WithoutToken_ShouldReturn401()
    {
        var client = _factory.CreateClient();

        var res = await client.PostAsJsonAsync("/api/rentals", new
        {
            startDate = "2026-03-01",
            endDate = "2026-03-03",
            items = new[] { new { deviceId = 1, quantity = 1 } }
        });

        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }

    [Fact]
    public async Task CreateRental_WithInvalidDates_ShouldReturn400()
    {
        var client = _factory.CreateClient();
        var token = await TestAuthHelper.RegisterAndLoginAsync(client);

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var res = await client.PostAsJsonAsync("/api/rentals", new
        {
            startDate = "2026-03-10",
            endDate = "2026-03-01",
            items = new[] { new { deviceId = 1, quantity = 1 } }
        });

        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }

    [Fact]
    public async Task CreateRental_WithEmptyItems_ShouldReturn400()
    {
        var client = _factory.CreateClient();
        var token = await TestAuthHelper.RegisterAndLoginAsync(client);

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var res = await client.PostAsJsonAsync("/api/rentals", new
        {
            startDate = "2026-03-01",
            endDate = "2026-03-03",
            items = Array.Empty<object>()
        });

        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }

    [Fact]
    public async Task GetById_WhenDifferentUser_ShouldReturn404()
    {
        var clientA = _factory.CreateClient();
        var tokenA = await TestAuthHelper.RegisterAndLoginAsync(clientA);
        clientA.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tokenA);

        var createRes = await clientA.PostAsJsonAsync("/api/rentals", new
        {
            startDate = "2026-03-01",
            endDate = "2026-03-03",
            items = new[] { new { deviceId = 1, quantity = 1 } }
        });

        Assert.Equal(HttpStatusCode.Created, createRes.StatusCode);

        var createdJson = await createRes.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(createdJson);
        var id = doc.RootElement.GetProperty("id").GetInt32();

        var clientB = _factory.CreateClient();
        var tokenB = await TestAuthHelper.RegisterAndLoginAsync(clientB);
        clientB.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", tokenB);

        var res = await clientB.GetAsync($"/api/rentals/{id}");

        Assert.Equal(HttpStatusCode.NotFound, res.StatusCode);
    }

    [Fact]
    public async Task CreateRental_WhenDeviceInactive_ShouldReturn400()
    {
        var client = _factory.CreateClient();
        var token = await TestAuthHelper.RegisterAndLoginAsync(client);

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        int inactiveDeviceId;

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var inactive = db.Devices.FirstOrDefault(d => !d.IsActive);
            Assert.NotNull(inactive);

            inactiveDeviceId = inactive!.Id;
        }

        var res = await client.PostAsJsonAsync("/api/rentals", new
        {
            startDate = "2026-03-01",
            endDate = "2026-03-03",
            items = new[] { new { deviceId = inactiveDeviceId, quantity = 1 } }
        });

        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }
    [Fact]
public async Task GetById_WithoutToken_ShouldReturn401()
{
    var client = _factory.CreateClient();

    var res = await client.GetAsync("/api/rentals/1");

    Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
}

[Fact]
public async Task CreateRental_WhenDeviceDoesNotExist_ShouldReturn400()
{
    var client = _factory.CreateClient();
    var token = await TestAuthHelper.RegisterAndLoginAsync(client);

    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", token);

    var res = await client.PostAsJsonAsync("/api/rentals", new
    {
        startDate = "2026-03-01",
        endDate = "2026-03-03",
        items = new[] { new { deviceId = 999999, quantity = 1 } }
    });

    Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
}

[Fact]
public async Task CreateRental_WhenQuantityExceedsAvailable_ShouldReturn400()
{
    var client = _factory.CreateClient();
    var token = await TestAuthHelper.RegisterAndLoginAsync(client);

    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", token);

    int deviceId;
    int available;

    using (var scope = _factory.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var dev = db.Devices.First(d => d.IsActive);
        deviceId = dev.Id;
        available = dev.AvailableQuantity;
    }

    var res = await client.PostAsJsonAsync("/api/rentals", new
    {
        startDate = "2026-03-01",
        endDate = "2026-03-03",
        items = new[] { new { deviceId, quantity = available + 1 } }
    });

    Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
}
[Fact]
public async Task CreateRental_WithToken_ShouldReturn201_AndBeVisibleInMyRentals_AndDetails()
{
    var client = _factory.CreateClient();
    var token = await TestAuthHelper.RegisterAndLoginAsync(client);

    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", token);

    int deviceId;

    using (var scope = _factory.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        deviceId = db.Devices.First(d => d.IsActive).Id;
    }

    var createRes = await client.PostAsJsonAsync("/api/rentals", new
    {
        startDate = "2026-03-01",
        endDate = "2026-03-03",
        items = new[] { new { deviceId, quantity = 1 } }
    });

    Assert.Equal(HttpStatusCode.Created, createRes.StatusCode);

    var createdJson = await createRes.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(createdJson);
    var id = doc.RootElement.GetProperty("id").GetInt32();

    var myRes = await client.GetAsync("/api/rentals/my");
    Assert.Equal(HttpStatusCode.OK, myRes.StatusCode);

    var myTxt = await myRes.Content.ReadAsStringAsync();
    Assert.Contains($"\"id\":{id}", myTxt);

    var detailsRes = await client.GetAsync($"/api/rentals/{id}");
    Assert.Equal(HttpStatusCode.OK, detailsRes.StatusCode);

    var detailsTxt = await detailsRes.Content.ReadAsStringAsync();
    Assert.Contains("\"items\"", detailsTxt);
}
}