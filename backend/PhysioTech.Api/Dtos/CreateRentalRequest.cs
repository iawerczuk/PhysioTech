using System.ComponentModel.DataAnnotations;

namespace PhysioTech.Api.Dtos;

public class CreateRentalRequest
{
    [Required] public DateOnly StartDate { get; set; }
    [Required] public DateOnly EndDate { get; set; }
    [Required] public List<CreateRentalItemRequest> Items { get; set; } = new();
}

public class CreateRentalItemRequest
{
    [Required] public int DeviceId { get; set; }
    [Range(1, int.MaxValue)] public int Quantity { get; set; }
}