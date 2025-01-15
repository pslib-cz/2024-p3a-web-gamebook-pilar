using GamebookPilar.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace GamebookPilar.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<Location> Locations { get; set; }
        public DbSet<Background> Backgrounds { get; set; }

        public DbSet<MoveButton> MoveButtons { get; set; }
        public DbSet<KeypadButton> KeypadButtons { get; set; }
        public DbSet<LockButton> LockButtons { get; set; }
        
        public DbSet<Switch> Switches { get; set; }

        public DbSet<Cutscene> Cutscenes { get; set; }
        public DbSet<Frame> Frames { get; set; }
        
        public DbSet<Status> Statuses { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Location>()
                .HasMany(l => l.Backgrounds)
                .WithOne(b => b.Location)
                .HasForeignKey(b => b.LocationId);

            modelBuilder.Entity<Location>()
                .HasMany(l => l.MoveButtons)
                .WithOne(m => m.Location)
                .HasForeignKey(m => m.LocationId);

            modelBuilder.Entity<Location>()
                .HasMany(l => l.KeypadButtons)
                .WithOne(k => k.Location)
                .HasForeignKey(k => k.LocationId);

            modelBuilder.Entity<Location>()
                .HasMany(l => l.LockButtons)
                .WithOne(lk => lk.Location)
                .HasForeignKey(lk => lk.LocationId);

            modelBuilder.Entity<Location>()
                .HasMany(l => l.Switches)
                .WithOne(lk => lk.Location)
                .HasForeignKey(lk => lk.LocationId);

            modelBuilder.Entity<Cutscene>()
                .HasMany(l => l.Frames)
                .WithOne(lk => lk.Cutscene)
                .HasForeignKey(lk => lk.CutsceneId);
        }

    }
    
}
