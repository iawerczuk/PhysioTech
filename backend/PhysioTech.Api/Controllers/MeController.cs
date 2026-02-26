using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PhysioTech.Api.Dtos;
using PhysioTech.Api.Models;
using PhysioTech.Api.Services;

namespace PhysioTech.Api.Controllers;

[ApiController]
[Route("api/me")]
[Authorize]
public class MeController : ControllerBase
{
    private readonly ICurrentUserService _currentUser;
    private readonly UserManager<UserApp> _userManager;

    public MeController(ICurrentUserService currentUser, UserManager<UserApp> userManager)
    {
        _currentUser = currentUser;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var u = await _currentUser.GetRequiredAsync(User);

        return Ok(new
        {
            u.Email,
            u.FirstName,
            u.LastName,
            u.Address,
            u.City,
            u.PostalCode,
            u.CompanyName,
            u.Nip,
            u.NeedInvoice
        });
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateMeRequest dto)
    {
        var u = await _currentUser.GetRequiredAsync(User);

        if (dto.FirstName is not null) u.FirstName = dto.FirstName;
        if (dto.LastName is not null) u.LastName = dto.LastName;

        if (dto.Address is not null) u.Address = dto.Address;
        if (dto.City is not null) u.City = dto.City;
        if (dto.PostalCode is not null) u.PostalCode = dto.PostalCode;

        if (dto.NeedInvoice.HasValue) u.NeedInvoice = dto.NeedInvoice.Value;
        if (dto.CompanyName is not null) u.CompanyName = dto.CompanyName;
        if (dto.Nip is not null) u.Nip = dto.Nip;

        var result = await _userManager.UpdateAsync(u);

        if (!result.Succeeded)
        {
            var msg = string.Join("; ", result.Errors.Select(e => e.Description));
            return BadRequest(msg);
        }

        return NoContent();
    }
}