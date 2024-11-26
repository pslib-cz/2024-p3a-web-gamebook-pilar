using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookPilar.Server.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Backgrounds",
                columns: table => new
                {
                    BackgroundId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    FullNaturalUrl = table.Column<string>(type: "TEXT", nullable: false),
                    EmptyNaturalUrl = table.Column<string>(type: "TEXT", nullable: false),
                    FullFlareUrl = table.Column<string>(type: "TEXT", nullable: false),
                    EmptyFlareUrl = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Backgrounds", x => x.BackgroundId);
                });

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    LocationId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Dialogue = table.Column<string>(type: "TEXT", nullable: false),
                    BackgroundId = table.Column<int>(type: "INTEGER", nullable: false),
                    ContainedItem = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.LocationId);
                    table.ForeignKey(
                        name: "FK_Locations_Backgrounds_BackgroundId",
                        column: x => x.BackgroundId,
                        principalTable: "Backgrounds",
                        principalColumn: "BackgroundId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KeypadButtons",
                columns: table => new
                {
                    KeypadButtonId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LocationX = table.Column<int>(type: "INTEGER", nullable: false),
                    LocationY = table.Column<int>(type: "INTEGER", nullable: false),
                    Label = table.Column<string>(type: "TEXT", nullable: false),
                    Pin = table.Column<int>(type: "INTEGER", nullable: false),
                    TargetLocationId = table.Column<int>(type: "INTEGER", nullable: false),
                    LocationId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeypadButtons", x => x.KeypadButtonId);
                    table.ForeignKey(
                        name: "FK_KeypadButtons_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "LocationId");
                });

            migrationBuilder.CreateTable(
                name: "LockButtons",
                columns: table => new
                {
                    LockButtonId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LocationX = table.Column<int>(type: "INTEGER", nullable: false),
                    LocationY = table.Column<int>(type: "INTEGER", nullable: false),
                    Label = table.Column<string>(type: "TEXT", nullable: false),
                    KeyIndex = table.Column<int>(type: "INTEGER", nullable: false),
                    TargetLocationId = table.Column<int>(type: "INTEGER", nullable: false),
                    LocationId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LockButtons", x => x.LockButtonId);
                    table.ForeignKey(
                        name: "FK_LockButtons_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "LocationId");
                });

            migrationBuilder.CreateTable(
                name: "MoveButtons",
                columns: table => new
                {
                    MoveButtonId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LocationX = table.Column<int>(type: "INTEGER", nullable: false),
                    LocationY = table.Column<int>(type: "INTEGER", nullable: false),
                    Label = table.Column<string>(type: "TEXT", nullable: false),
                    TargetLocationId = table.Column<int>(type: "INTEGER", nullable: false),
                    LocationId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MoveButtons", x => x.MoveButtonId);
                    table.ForeignKey(
                        name: "FK_MoveButtons_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "LocationId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_KeypadButtons_LocationId",
                table: "KeypadButtons",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_BackgroundId",
                table: "Locations",
                column: "BackgroundId");

            migrationBuilder.CreateIndex(
                name: "IX_LockButtons_LocationId",
                table: "LockButtons",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_MoveButtons_LocationId",
                table: "MoveButtons",
                column: "LocationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KeypadButtons");

            migrationBuilder.DropTable(
                name: "LockButtons");

            migrationBuilder.DropTable(
                name: "MoveButtons");

            migrationBuilder.DropTable(
                name: "Locations");

            migrationBuilder.DropTable(
                name: "Backgrounds");
        }
    }
}
