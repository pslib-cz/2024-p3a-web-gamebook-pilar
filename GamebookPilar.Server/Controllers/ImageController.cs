using Microsoft.AspNetCore.Mvc;

namespace GamebookPilar.Server.Controllers;

public class ImageController : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }
}