using Microsoft.EntityFrameworkCore;
using GamebookPilar.Server.Data;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.SetIsOriginAllowed(origin =>
        {
            var uri = new Uri(origin);
            return uri.IsLoopback || uri.Host == "id-86.pslib.cloud";
        });
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors(x => x.AllowAnyMethod().SetIsOriginAllowed(origin =>
{
    var uri = new Uri(origin);
    return uri.IsLoopback || uri.Host == "id-86.pslib.cloud";
}));

app.UseDefaultFiles();

// Configure the HTTP request pipeline.
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();