using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DriverTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RefactorRouteFinancialFieldsAndAddFuelPrices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Earnings",
                table: "RouteTypes",
                newName: "DriverPayment");

            migrationBuilder.RenameColumn(
                name: "Earnings",
                table: "RouteEntries",
                newName: "DriverPayment");

            migrationBuilder.AddColumn<decimal>(
                name: "Revenue",
                table: "RouteTypes",
                type: "TEXT",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Revenue",
                table: "RouteEntries",
                type: "TEXT",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "FuelPrices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    PricePerLiter = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false),
                    EffectiveFrom = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FuelPrices", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FuelPrices_EffectiveFrom",
                table: "FuelPrices",
                column: "EffectiveFrom");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FuelPrices");

            migrationBuilder.DropColumn(
                name: "Revenue",
                table: "RouteTypes");

            migrationBuilder.DropColumn(
                name: "Revenue",
                table: "RouteEntries");

            migrationBuilder.RenameColumn(
                name: "DriverPayment",
                table: "RouteTypes",
                newName: "Earnings");

            migrationBuilder.RenameColumn(
                name: "DriverPayment",
                table: "RouteEntries",
                newName: "Earnings");
        }
    }
}
