namespace PhysioTech.Api.Dtos;

public class CreateRentalItem
{
    public int DeviceId { get; set; }
    public int Quantity { get; set; }
}

public class CreateRentalDto
{
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public List<CreateRentalItem> Items { get; set; } = new();
}