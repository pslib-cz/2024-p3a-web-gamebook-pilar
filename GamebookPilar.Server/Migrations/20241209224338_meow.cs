using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookPilar.Server.Migrations
{
    /// <inheritdoc />
    public partial class meow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Statuses_Huds_HudId",
                table: "Statuses");

            migrationBuilder.DropTable(
                name: "Huds");

            migrationBuilder.DropIndex(
                name: "IX_Statuses_HudId",
                table: "Statuses");

            migrationBuilder.DropColumn(
                name: "HudId",
                table: "Statuses");

            migrationBuilder.AddColumn<bool>(
                name: "IsLit",
                table: "Locations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsLit",
                table: "Locations");

            migrationBuilder.AddColumn<int>(
                name: "HudId",
                table: "Statuses",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

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

            migrationBuilder.CreateIndex(
                name: "IX_Statuses_HudId",
                table: "Statuses",
                column: "HudId");

            migrationBuilder.AddForeignKey(
                name: "FK_Statuses_Huds_HudId",
                table: "Statuses",
                column: "HudId",
                principalTable: "Huds",
                principalColumn: "HudId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
