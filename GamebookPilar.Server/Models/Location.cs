namespace GamebookPilar.Server.Models;
public class Location
{
    public int LocationId { get; set; }
    public string Name { get; set; }
    public string Dialogue { get; set; }
    public Background Background { get; set; }
    public int ContainedItem { get; set; } // 0 is nothing, 1 is cigarettes, 2 is flare, 3 is candle, 4 is page
    public MoveButton[] MoveButtons { get; set; }
    public KeypadButton[] KeypadButtons { get; set; }
    public LockButton[] LockButtons { get; set; }
}