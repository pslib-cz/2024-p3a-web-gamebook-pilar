using GamebookPilar.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace GamebookPilar.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {
            
        }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Background> Backgrounds { get; set; }
        public DbSet<MoveButton> MoveButtons { get; set; }
        public DbSet<KeypadButton> KeypadButtons { get; set; }
        public DbSet<LockButton> LockButtons { get; set; }
    }
}
