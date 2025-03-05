namespace GamebookPilar.Server.Models;
public class Location
{
    public int LocationId { get; set; }
    public string Name { get; set; }
    public string Monologue { get; set; }
    public int? ContainedItem { get; set; } // null is nothing, 0 is cigarettes, 1 is flare, 2 is candle, 3 is page, 4 is key
    public int? ItemIndex { get; set; }
    public int? SwitchIndex { get; set; }
    public bool IsCutscene { get; set; }
    public bool IsLit { get; set; }
    
    public ICollection<MoveButton> MoveButtons { get; set; }
    public ICollection<Background> Backgrounds { get; set; }
    public ICollection<Switch> Switches { get; set; }
}