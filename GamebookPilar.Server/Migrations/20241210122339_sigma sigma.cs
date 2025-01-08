using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookPilar.Server.Migrations
{
    /// <inheritdoc />
    public partial class sigmasigma : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StatusID",
                table: "Statuses",
                newName: "StatusId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StatusId",
                table: "Statuses",
                newName: "StatusID");
        }
    }
}
