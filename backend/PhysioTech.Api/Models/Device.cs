namespace PhysioTech.Api.Models;

public class Device
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal PricePerDay { get; set; }
    public decimal Deposit { get; set; }
    public int AvailableQuantity { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public List<RentalDetail> RentalDetails { get; set; } = new();
    
}