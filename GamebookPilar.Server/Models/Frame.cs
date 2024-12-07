namespace GamebookPilar.Server.Models;

public class Frame
{
    public int FrameId { get; set; }
    public string ImageUrl { get; set; }
    public int FrameIndex { get; set; }
    public string Monologue { get; set; }
    
    public int CutsceneId { get; set; }
    public Cutscene Cutscene { get; set; }
}