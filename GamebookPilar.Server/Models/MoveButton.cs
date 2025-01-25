using System.Text.Json.Serialization;

namespace GamebookPilar.Server.Models;

public class MoveButton
{
    public int MoveButtonId { get; set; }
    public int LocationX { get; set; }
    public int LocationY { get; set; }
    public string Label { get; set; }
    public string? Pin { get; set; }
    public int? KeyIndex { get; set; }
    public int TargetLocationId { get; set; }
    
    public int LocationId { get; set; }
    [JsonIgnore]
    public Location Location { get; set; }
}