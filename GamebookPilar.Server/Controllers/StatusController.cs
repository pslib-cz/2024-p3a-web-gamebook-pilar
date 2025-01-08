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
    public class CutsceneController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CutsceneController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Cutscene
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cutscene>>> GetCutscenes()
        {
            return await _context.Cutscenes.ToListAsync();
        }

        // GET: api/Cutscene/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cutscene>> GetCutscene(int id)
        {
            var cutscene = await _context.Cutscenes
                .Include(c => c.Frames)
                .FirstOrDefaultAsync(c => c.CutsceneId == id);

            if (cutscene == null)
            {
                return NotFound();
            }

            return cutscene;
        }

        // PUT: api/Cutscene/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCutscene(int id, Cutscene cutscene)
        {
            if (id != cutscene.CutsceneId)
            {
                return BadRequest();
            }

            _context.Entry(cutscene).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CutsceneExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Cutscene
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Cutscene>> PostCutscene(Cutscene cutscene)
        {
            _context.Cutscenes.Add(cutscene);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCutscene", new { id = cutscene.CutsceneId }, cutscene);
        }

        // DELETE: api/Cutscene/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCutscene(int id)
        {
            var cutscene = await _context.Cutscenes.FindAsync(id);
            if (cutscene == null)
            {
                return NotFound();
            }

            _context.Cutscenes.Remove(cutscene);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CutsceneExists(int id)
        {
            return _context.Cutscenes.Any(e => e.CutsceneId == id);
        }
    }
}
