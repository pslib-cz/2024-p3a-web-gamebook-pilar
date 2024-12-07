namespace GamebookPilar.Server.Models;

public class KeypadButton
{
    public int KeypadButtonId { get; set; }
    public int LocationX { get; set; }
    public int LocationY { get; set; }
    public string Label { get; set; }
    public int Pin { get; set; }
    public int TargetLocationId { get; set; }
    
    public int LocationId { get; set; }
    public Location Location { get; set; }
}