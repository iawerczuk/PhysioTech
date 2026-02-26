using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhysioTech.Api.Data;
using PhysioTech.Api.Dtos;
using PhysioTech.Api.Models;

namespace PhysioTech.Api.Controllers;

[ApiController]
[Route("api/rentals")]
public class RentalsController : ControllerBase
{
    private readonly AppDbContext _db;

    public RentalsController(AppDbContext db)
    {
        _db = db;
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> MyRentals()
    {
        var userId =
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized(new { message = "Brak identyfikatora użytkownika w tokenie." });

        var rentals = await _db.Rentals
            .AsNoTracking()
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.Id)
            .Select(r => new
            {
                id = r.Id,
                startDate = r.StartDate,
                endDate = r.EndDate,
                status = r.Status.ToString(),
                createdAt = r.CreatedAt,
                devices = r.Details.Select(x => new
                {
                    deviceId = x.DeviceId,
                    deviceName = x.Device.Name,
                    quantity = x.Quantity,
                    pricePerDay = x.PricePerDay,
                    deposit = x.Deposit
                }).ToList()
            })
            .ToListAsync();

        return Ok(rentals);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateRental([FromBody] CreateRentalRequest req)
    {
        var userId =
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized(new { message = "Brak identyfikatora użytkownika w tokenie." });

        if (req.Items == null || req.Items.Count == 0)
            return BadRequest(new { message = "Lista Items nie może być pusta." });

        if (req.EndDate < req.StartDate)
            return BadRequest(new { message = "EndDate nie może być wcześniejsza niż StartDate." });

        var deviceIds = req.Items.Select(i => i.DeviceId).Distinct().ToList();

        var devices = await _db.Devices
            .Where(d => deviceIds.Contains(d.Id) && d.IsActive)
            .ToListAsync();

        if (devices.Count != deviceIds.Count)
            return BadRequest(new { message = "Jedno lub więcej urządzeń nie istnieje lub jest nieaktywne." });

        foreach (var item in req.Items)
        {
            if (item.Quantity <= 0)
                return BadRequest(new { message = "Quantity musi być > 0." });

            var dev = devices.First(d => d.Id == item.DeviceId);

            if (item.Quantity > dev.AvailableQuantity)
                return BadRequest(new
                {
                    message = $"Brak dostępnej ilości dla: {dev.Name}. Dostępne: {dev.AvailableQuantity}"
                });
        }

        var rental = new Rental
        {
            UserId = userId,
            StartDate = req.StartDate,
            EndDate = req.EndDate,
            Status = RentalStatus.Draft,
            CreatedAt = DateTime.UtcNow,
            Details = req.Items.Select(i =>
            {
                var dev = devices.First(d => d.Id == i.DeviceId);

                return new RentalDetail
                {
                    DeviceId = dev.Id,
                    Quantity = i.Quantity,
                    PricePerDay = dev.PricePerDay,
                    Deposit = dev.Deposit
                };
            }).ToList()
        };

        _db.Rentals.Add(rental);
        await _db.SaveChangesAsync();

        return StatusCode(201, new
        {
            id = rental.Id,
            message = "Wypożyczenie utworzone."
        });
    }
}