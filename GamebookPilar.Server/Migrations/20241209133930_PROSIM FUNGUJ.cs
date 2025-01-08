using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookPilar.Server.Migrations
{
    /// <inheritdoc />
    public partial class PROSIMFUNGUJ : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Huds",
                columns: table => new
                {
                    HudId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Huds", x => x.HudId);
                });

            migrationBuilder.CreateTable(
                name: "Statuses",
                columns: table => new
                {
                    StatusID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false),
                    SanityIndex = table.Column<int>(type: "INTEGER", nullable: false),
                    HudId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Statuses", x => x.StatusID);
                    table.ForeignKey(
                        name: "FK_Statuses_Huds_HudId",
                        column: x => x.HudId,
                        principalTable: "Huds",
                        principalColumn: "HudId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Statuses_HudId",
                table: "Statuses",
                column: "HudId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Statuses");

            migrationBuilder.DropTable(
                name: "Huds");
        }
    }
}
