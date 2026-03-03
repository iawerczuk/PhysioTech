using System.Data.Common;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PhysioTech.Api.Data;
using PhysioTech.Api.Models;

namespace PhysioTech.Api.Tests;

public sealed class TestAppFactory : WebApplicationFactory<Program>
{
    private DbConnection? _connection;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            // usuń produkcyjne rejestracje bazy
            services.RemoveAll(typeof(DbContextOptions<AppDbContext>));
            services.RemoveAll(typeof(AppDbContext));

            // SQLite in-memory trzymana na otwartym połączeniu
            _connection = new SqliteConnection("Data Source=:memory:;Cache=Shared");
            _connection.Open();

            services.AddDbContext<AppDbContext>(opt => opt.UseSqlite(_connection));

            // budujemy provider aby zrobić seed
            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();

            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.EnsureCreated();

            // seed minimalnych ról
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            string[] roles = { "USER", "ADMIN" };

            foreach (var r in roles)
            {
                if (!roleManager.RoleExistsAsync(r).GetAwaiter().GetResult())
                {
                    roleManager.CreateAsync(new IdentityRole(r)).GetAwaiter().GetResult();
                }
            }

            // seed urządzeń do testów tylko jeśli ich nie ma
            if (!db.Devices.Any())
            {
                db.Devices.AddRange(
                    new Device
                    {
                        Name = "Test Device",
                        IsActive = true,
                        AvailableQuantity = 10,
                        PricePerDay = 25m,
                        Deposit = 200m
                    },
                    new Device
                    {
                        Name = "Inactive Device",
                        IsActive = false,
                        AvailableQuantity = 5,
                        PricePerDay = 15m,
                        Deposit = 100m
                    }
                );

                db.SaveChanges();
            }

            // Wymuszenie przewidywalnego stanu dla testów:
            // device 1 aktywny, device 2 nieaktywny
            var d1 = db.Devices.FirstOrDefault(d => d.Id == 1) ?? db.Devices.OrderBy(d => d.Id).FirstOrDefault();
            if (d1 is not null && !d1.IsActive)
            {
                d1.IsActive = true;
            }

            var d2 = db.Devices.FirstOrDefault(d => d.Id == 2);

            if (d2 is null)
            {
                // jeśli nie ma id=2, wybierz inne niż d1 i ustaw jako nieaktywne
                d2 = db.Devices
                    .OrderBy(d => d.Id)
                    .FirstOrDefault(d => d1 == null || d.Id != d1.Id);
            }

            if (d2 is not null && d2.IsActive)
            {
                d2.IsActive = false;
            }

            db.SaveChanges();
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);

        if (disposing)
        {
            _connection?.Dispose();
            _connection = null;
        }
    }
}