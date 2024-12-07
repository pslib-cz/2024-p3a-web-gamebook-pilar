namespace GamebookPilar.Server.Models;

public class MoveButton
{
    public int MoveButtonId { get; set; }
    public int LocationX { get; set; }
    public int LocationY { get; set; }
    public string Label { get; set; }
    public int TargetLocationId { get; set; }
    
    public int LocationId { get; set; }
    public Location Location { get; set; }
}