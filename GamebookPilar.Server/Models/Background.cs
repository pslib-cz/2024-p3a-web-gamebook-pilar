using System.Text.Json.Serialization;

namespace GamebookPilar.Server.Models;

public class Background
{
    public int BackgroundId { get; set; }
    public bool FlareActive { get; set; }
    public bool HasItem { get; set; }
    public string ImageUrl { get; set; }
    
    public int LocationId { get; set; }
    [JsonIgnore]
    public Location Location { get; set; }
}