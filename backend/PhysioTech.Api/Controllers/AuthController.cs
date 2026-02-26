using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PhysioTech.Api.Dtos;
using PhysioTech.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PhysioTech.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<UserApp> _userManager;
    private readonly SignInManager<UserApp> _signInManager;
    private readonly IConfiguration _config;

    public AuthController(
        UserManager<UserApp> userManager,
        SignInManager<UserApp> signInManager,
        IConfiguration config)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req)    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { message = "Email i hasło są wymagane." });

        var user = new UserApp
        {
            UserName = req.Email.Trim(),
            Email = req.Email.Trim()
        };

        var created = await _userManager.CreateAsync(user, req.Password);
        if (!created.Succeeded)
            return BadRequest(created.Errors.Select(e => e.Description));

        var roleResult = await _userManager.AddToRoleAsync(user, "USER");
        if (!roleResult.Succeeded)
            return StatusCode(500, new { message = "Nie udało się przypisać roli.", errors = roleResult.Errors.Select(e => e.Description) });

        return StatusCode(201, new { message = "Utworzono konto." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _userManager.FindByEmailAsync(req.Email);
        if (user is null)
            return Unauthorized("Błędny email lub hasło.");

        var check = await _signInManager.CheckPasswordSignInAsync(user, req.Password, lockoutOnFailure: true);
        if (!check.Succeeded)
            return  Unauthorized("Błędny email lub hasło.");

        var roles = await _userManager.GetRolesAsync(user);

        var jwt = _config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.UserName ?? user.Email ?? "")
        };

        foreach (var r in roles)
            claims.Add(new Claim(ClaimTypes.Role, r));

        var expires = DateTime.UtcNow.AddHours(72);

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return Ok(new
        {
            accessToken = new JwtSecurityTokenHandler().WriteToken(token),
            expiresUtc = expires,
            roles
        });
    }

#if DEBUG
[HttpPost("dev/reset-password")]
public async Task<IActionResult> DevResetPassword([FromBody] DevResetPasswordRequest req)
{
    if (req is null)
        return BadRequest(new { message = "Brak body." });

    if (string.IsNullOrWhiteSpace(req.Email))
        return BadRequest(new { message = "Email jest wymagany." });

    if (string.IsNullOrWhiteSpace(req.NewPassword))
        return BadRequest(new { message = "NewPassword jest wymagane." });

    var user = await _userManager.FindByEmailAsync(req.Email);
    if (user is null)
        return NotFound(new { message = "Nie znaleziono użytkownika." });

    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
    var result = await _userManager.ResetPasswordAsync(user, token, req.NewPassword);

    if (!result.Succeeded)
        return BadRequest(result.Errors.Select(e => e.Description));

    return Ok(new { message = "Hasło zresetowane." });
}

public class DevResetPasswordRequest
{
    public string Email { get; set; } = "";
    public string NewPassword { get; set; } = "";
}}
#endif