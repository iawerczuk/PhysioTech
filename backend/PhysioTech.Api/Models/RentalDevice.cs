namespace PhysioTech.Api.Models;

public class RentalDevice
{
    public int Id { get; set; }

    public int RentalId { get; set; }
    public Rental Rental { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int Quantity { get; set; }
    public decimal PricePerDaySnapshot { get; set; }
    public decimal DepositSnapshot { get; set; }
}