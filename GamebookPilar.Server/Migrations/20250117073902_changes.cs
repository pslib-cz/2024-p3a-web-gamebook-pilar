using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookPilar.Server.Migrations
{
    /// <inheritdoc />
    public partial class changes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Frames_Cutscenes_CutsceneId",
                table: "Frames");

            migrationBuilder.DropTable(
                name: "Cutscenes");

            migrationBuilder.RenameColumn(
                name: "CutsceneId",
                table: "Frames",
                newName: "LocationId");

            migrationBuilder.RenameIndex(
                name: "IX_Frames_CutsceneId",
                table: "Frames",
                newName: "IX_Frames_LocationId");

            migrationBuilder.AlterColumn<int>(
                name: "SwitchIndex",
                table: "Locations",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<int>(
                name: "ItemIndex",
                table: "Locations",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<int>(
                name: "ContainedItem",
                table: "Locations",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<int>(
                name: "CutsceneIndex",
                table: "Locations",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Frames_Locations_LocationId",
                table: "Frames",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "LocationId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Frames_Locations_LocationId",
                table: "Frames");

            migrationBuilder.DropColumn(
                name: "CutsceneIndex",
                table: "Locations");

            migrationBuilder.RenameColumn(
                name: "LocationId",
                table: "Frames",
                newName: "CutsceneId");

            migrationBuilder.RenameIndex(
                name: "IX_Frames_LocationId",
                table: "Frames",
                newName: "IX_Frames_CutsceneId");

            migrationBuilder.AlterColumn<int>(
                name: "SwitchIndex",
                table: "Locations",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ItemIndex",
                table: "Locations",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ContainedItem",
                table: "Locations",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "Cutscenes",
                columns: table => new
                {
                    CutsceneId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TargetLocationId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cutscenes", x => x.CutsceneId);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Frames_Cutscenes_CutsceneId",
                table: "Frames",
                column: "CutsceneId",
                principalTable: "Cutscenes",
                principalColumn: "CutsceneId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
