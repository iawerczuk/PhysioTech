using System.Security.Claims;
using PhysioTech.Api.Models;

namespace PhysioTech.Api.Services;

public interface ICurrentUserService
{
    Task<UserApp?> GetAsync(ClaimsPrincipal principal, CancellationToken ct = default);
    Task<UserApp> GetRequiredAsync(ClaimsPrincipal principal, CancellationToken ct = default);
}