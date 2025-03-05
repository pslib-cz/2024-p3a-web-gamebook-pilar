using Microsoft.AspNetCore.Mvc;

namespace GamebookPilar.Server.Controllers;

public class StateController : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }
}