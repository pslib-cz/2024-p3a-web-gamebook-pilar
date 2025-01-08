using System.Text.Json.Serialization;

namespace GamebookPilar.Server.Models;

public class Status
{
    public int StatusId { get; set; }
    public string ImageUrl { get; set; }
    public int SanityIndex { get; set; }
}