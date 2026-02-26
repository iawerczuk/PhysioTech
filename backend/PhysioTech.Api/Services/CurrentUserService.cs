using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using PhysioTech.Api.Models;

namespace PhysioTech.Api.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly UserManager<UserApp> _userManager;

    public CurrentUserService(UserManager<UserApp> userManager)
    {
        _userManager = userManager;
    }

    public Task<UserApp?> GetAsync(ClaimsPrincipal principal, CancellationToken ct = default)
    {
        return _userManager.GetUserAsync(principal);
    }

    public async Task<UserApp> GetRequiredAsync(ClaimsPrincipal principal, CancellationToken ct = default)
    {
        var user = await _userManager.GetUserAsync(principal);
        if (user is null)
            throw new UnauthorizedAccessException("Brak autoryzacji.");

        return user;
    }
}