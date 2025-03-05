using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GamebookPilar.Server.Data;
using GamebookPilar.Server.Models;

namespace GamebookPilar.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LocationController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Location/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Location>> GetLocation(int id)
        {
            var location = await _context.Locations
                .Include(p => p.Backgrounds)
                .Include(p => p.MoveButtons)
                .Include(p=> p.Switches)
                .FirstOrDefaultAsync(p => p.LocationId == id);;

            if (location == null)
            {
                return NotFound();
            }

            return location;
        }

        private bool LocationExists(int id)
        {
            return _context.Locations.Any(e => e.LocationId == id);
        }
    }
}
