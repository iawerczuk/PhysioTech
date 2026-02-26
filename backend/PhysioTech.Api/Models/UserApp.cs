using Microsoft.AspNetCore.Identity;

namespace PhysioTech.Api.Models;

public class UserApp : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    public string? Address { get; set; }
    public string? City { get; set; }
    public string? PostalCode { get; set; }

    public bool NeedInvoice { get; set; }
    public string? CompanyName { get; set; }
    public string? Nip { get; set; }
}