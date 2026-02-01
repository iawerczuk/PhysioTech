using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhysioTech.Api.Data;
using PhysioTech.Api.Dtos;
using PhysioTech.Api.Models;

namespace PhysioTech.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RentalsController : ControllerBase
{
    private readonly AppDbContext _db;

    public RentalsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("me")]
    public async Task<IActionResult> MyRentals()
    {
        var userId =
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        var rentals = await _db.Rentals
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.Id)
            .Select(r => new
            {
                r.Id,
                r.StartDate,
                r.EndDate,
                r.Status,
                Items = r.Details.Select(d => new
                {
                    d.DeviceId,
                    DeviceName = d.Device != null ? d.Device.Name : null,
                    d.Quantity,
                    d.PricePerDaySnapshot
                })
            })
            .ToListAsync();

        return Ok(rentals);
    }
    [HttpPost]
public async Task<IActionResult> CreateRental([FromBody] CreateRentalDto request)
{
    var userId =
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub");

    if (string.IsNullOrWhiteSpace(userId))
        return Unauthorized();

    if (request.Items == null || request.Items.Count == 0)
        return BadRequest("Items are required.");

    if (request.EndDate < request.StartDate)
        return BadRequest("EndDate must be >= StartDate.");

    if (request.Items.Any(i => i.Quantity <= 0))
        return BadRequest("Quantity must be > 0.");

    var deviceIds = request.Items.Select(i => i.DeviceId).Distinct().ToList();

    var devices = await _db.Devices
        .Where(d => deviceIds.Contains(d.Id))
        .ToListAsync();

    if (devices.Count != deviceIds.Count)
        return BadRequest("One or more devices do not exist.");

    foreach (var item in request.Items)
    {
        var device = devices.First(d => d.Id == item.DeviceId);

        if (device.AvailableQuantity < item.Quantity)
            return BadRequest($"Device '{device.Name}' has not enough availability.");
    }

    var rental = new Rental
    {
        UserId = userId,
        StartDate = request.StartDate,
        EndDate = request.EndDate,
        Status = RentalStatus.Draft
    };

    foreach (var item in request.Items)
    {
        var device = devices.First(d => d.Id == item.DeviceId);

        rental.Details.Add(new RentalDetail
        {
            DeviceId = device.Id,
            Quantity = item.Quantity,
            PricePerDaySnapshot = device.PricePerDay
        });

        device.AvailableQuantity -= item.Quantity;
    }

    _db.Rentals.Add(rental);
    await _db.SaveChangesAsync();

    return CreatedAtAction(nameof(MyRentals), new { }, new { rentalId = rental.Id });
}
[HttpPost("{id:int}/cancel")]
public async Task<IActionResult> Cancel(int id)
{
    var userId =
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub");

    if (string.IsNullOrWhiteSpace(userId))
        return Unauthorized();

    var rental = await _db.Rentals
        .Include(r => r.Details)
        .FirstOrDefaultAsync(r => r.Id == id);

    if (rental == null)
        return NotFound();

    if (rental.UserId != userId)
        return Forbid();

    if (rental.Status == RentalStatus.Paid)
        return BadRequest("Paid rental cannot be cancelled.");

    if (rental.Status == RentalStatus.Cancelled)
        return BadRequest("Rental is already cancelled.");

    var deviceIds = rental.Details.Select(d => d.DeviceId).Distinct().ToList();
    var devices = await _db.Devices.Where(d => deviceIds.Contains(d.Id)).ToListAsync();

    foreach (var detail in rental.Details)
    {
        var device = devices.First(d => d.Id == detail.DeviceId);
        device.AvailableQuantity += detail.Quantity;
    }

    rental.Status = RentalStatus.Cancelled;

    await _db.SaveChangesAsync();

    return Ok(new { rentalId = rental.Id, status = rental.Status });
}
}