namespace PhysioTech.Api.Dtos;

public class CreateRentalRequest
{
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }

    public List<CreateRentalItemRequest> Items { get; set; } = new();
}

public class CreateRentalItemRequest
{
    public int DeviceId { get; set; }
    public int Quantity { get; set; }
}