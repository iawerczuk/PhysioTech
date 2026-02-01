using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PhysioTech.Api.Models;

namespace PhysioTech.Api.Data;

public class AppDbContext : IdentityDbContext<UserApp>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Device> Devices => Set<Device>();
    public DbSet<Rental> Rentals => Set<Rental>();
    public DbSet<RentalDetail> RentalDetails => Set<RentalDetail>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Rental>()
            .HasMany(r => r.Details)
            .WithOne(d => d.Rental)
            .HasForeignKey(d => d.RentalId);

        builder.Entity<RentalDetail>()
            .HasOne(d => d.Device)
            .WithMany()
            .HasForeignKey(d => d.DeviceId);

        var dateOnlyConverter = new ValueConverter<DateOnly, string>(
            d => d.ToString("yyyy-MM-dd"),
            s => DateOnly.Parse(s)
        );

        builder.Entity<Rental>()
            .Property(r => r.StartDate)
            .HasConversion(dateOnlyConverter);

        builder.Entity<Rental>()
            .Property(r => r.EndDate)
            .HasConversion(dateOnlyConverter);

        builder.Entity<Device>().HasData(
            new Device
            {
                Id = 1,
                Name = "Elektrostymulator COMPEX",
                Description = "Urządzenie do elektrostymulacji mięśni.",
                PricePerDay = 25m,
                Deposit = 200m,
                AvailableQuantity = 10,
                IsActive = true
            },
            new Device
            {
                Id = 2,
                Name = "iWalk",
                Description = "Alternatywa dla kul.",
                PricePerDay = 35m,
                Deposit = 300m,
                AvailableQuantity = 3,
                IsActive = true
            },
            new Device
            {
                Id = 3,
                Name = "Reboots",
                Description = "Kompresja pneumatyczna do regeneracji.",
                PricePerDay = 45m,
                Deposit = 400m,
                AvailableQuantity = 2,
                IsActive = true
            },
            new Device
            {
                Id = 4,
                Name = "Kule Ergobaum",
                Description = "Regulowane, składane, ergonomiczne kule amortyzujące wstrząsy.",
                PricePerDay = 20m,
                Deposit = 500m,
                AvailableQuantity = 10,
                IsActive = true
            },
            new Device
            {
                Id = 5,
                Name = "Cold Recovery",
                Description = "Połączenie chłodzenia i aktywnego ucisku.",
                PricePerDay = 10m,
                Deposit = 50m,
                AvailableQuantity = 15,
                IsActive = true
            }
        );
    }
}