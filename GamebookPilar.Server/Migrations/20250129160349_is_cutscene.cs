using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookPilar.Server.Migrations
{
    /// <inheritdoc />
    public partial class is_cutscene : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KeypadButtons");

            migrationBuilder.DropTable(
                name: "LockButtons");

            migrationBuilder.DropColumn(
                name: "CutsceneIndex",
                table: "Locations");

            migrationBuilder.AddColumn<bool>(
                name: "IsCutscene",
                table: "Locations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCutscene",
                table: "Locations");

            migrationBuilder.AddColumn<int>(
                name: "CutsceneIndex",
                table: "Locations",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "KeypadButtons",
                columns: table => new
                {
                    KeypadButtonId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LocationId = table.Column<int>(type: "INTEGER", nullable: false),
                    Label = table.Column<string>(type: "TEXT", nullable: false),
                    LocationX = table.Column<int>(type: "INTEGER", nullable: false),
                    LocationY = table.Column<int>(type: "INTEGER", nullable: false),
                    Pin = table.Column<string>(type: "TEXT", nullable: false),
                    TargetLocationId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeypadButtons", x => x.KeypadButtonId);
                    table.ForeignKey(
                        name: "FK_KeypadButtons_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LockButtons",
                columns: table => new
                {
                    LockButtonId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LocationId = table.Column<int>(type: "INTEGER", nullable: false),
                    KeyIndex = table.Column<int>(type: "INTEGER", nullable: false),
                    Label = table.Column<string>(type: "TEXT", nullable: false),
                    LocationX = table.Column<int>(type: "INTEGER", nullable: false),
                    LocationY = table.Column<int>(type: "INTEGER", nullable: false),
                    TargetLocationId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LockButtons", x => x.LockButtonId);
                    table.ForeignKey(
                        name: "FK_LockButtons_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KeypadButtons_LocationId",
                table: "KeypadButtons",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_LockButtons_LocationId",
                table: "LockButtons",
                column: "LocationId");
        }
    }
}
