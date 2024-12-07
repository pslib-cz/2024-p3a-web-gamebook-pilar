namespace GamebookPilar.Server.Models;

public class Cutscene
{
    public int CutsceneId { get; set; }
    public int TargetLocationId { get; set; }
    
    public ICollection<Frame> Frames { get; set; }
}