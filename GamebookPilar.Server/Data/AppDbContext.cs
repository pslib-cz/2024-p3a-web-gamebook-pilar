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
    }
}
