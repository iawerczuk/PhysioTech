namespace PhysioTech.Api.Models;

public class Rental
{
    public int Id { get; set; }
    public string UserId { get; set; } = "";
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public RentalStatus Status { get; set; } = RentalStatus.Draft;

    public List<RentalDetail> Details { get; set; } = new();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}