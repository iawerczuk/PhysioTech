namespace PhysioTech.Api.Dtos;

public class MyRentalDto
{
    public int Id { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? Status { get; set; }
    public List<RentalDeviceDto> Devices { get; set; } = new();
}

public class RentalDeviceDto
{
    public int DeviceId { get; set; }
    public string DeviceName { get; set; } = "";
    public int Quantity { get; set; }
    public decimal PricePerDay { get; set; }
    public decimal Deposit { get; set; }
}