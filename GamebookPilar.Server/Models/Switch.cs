using System.Text.Json.Serialization;

namespace GamebookPilar.Server.Models;

public class Switch
{
    public int SwitchId { get; set; }
    public int LocationX { get; set; }
    public int LocationY { get; set; }
    public int SwitchIndex { get; set; }
    public int TargetLocationId { get; set; }
    
    public int LocationId { get; set; }
    [JsonIgnore]
    public Location Location { get; set; }
}