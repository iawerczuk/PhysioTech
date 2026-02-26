using System.ComponentModel.DataAnnotations;

namespace PhysioTech.Api.Dtos;

public class UpdateMeRequest
{
    [MaxLength(100)]
    public string? FirstName { get; set; }

    [MaxLength(100)]
    public string? LastName { get; set; }

    [MaxLength(200)]
    public string? Address { get; set; }

    [MaxLength(100)]
    public string? City { get; set; }

    [RegularExpression(@"^\d{2}-\d{3}$", ErrorMessage = "Kod pocztowy musi mieć format 00-000")]
    public string? PostalCode { get; set; }

    public bool? NeedInvoice { get; set; }

    [MaxLength(200)]
    public string? CompanyName { get; set; }

    [RegularExpression(@"^\d{10}$", ErrorMessage = "NIP musi mieć 10 cyfr")]
    public string? Nip { get; set; }
}