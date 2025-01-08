using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookPilar.Server.Migrations
{
    /// <inheritdoc />
    public partial class nameadd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Locations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Locations");
        }
    }
}
