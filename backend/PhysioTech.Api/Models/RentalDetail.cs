namespace PhysioTech.Api.Models;

public class RentalDetail
{
    public int Id { get; set; }

    public int RentalId { get; set; }
    public Rental Rental { get; set; } = null!;

    public int DeviceId { get; set; }
    public Device Device { get; set; } = null!;

    public int Quantity { get; set; }

    public decimal PricePerDaySnapshot { get; set; }
}