namespace GamebookPilar.Server.Models;
public class Location
{
    public int LocationId { get; set; }
    public string Name { get; set; }
    public string Monologue { get; set; }
    public int ContainedItem { get; set; } // -1 is nothing, 0 is cigarettes, 1 is flare, 2 is candle, 3 is page, 4 is key
    public int ItemIndex { get; set; }
    public bool IsLit { get; set; }
    
    public ICollection<MoveButton> MoveButtons { get; set; }
    public ICollection<KeypadButton> KeypadButtons { get; set; }
    public ICollection<LockButton> LockButtons { get; set; }
    public ICollection<Background> Backgrounds { get; set; }
}