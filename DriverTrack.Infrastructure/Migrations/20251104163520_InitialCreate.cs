using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DriverTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Drivers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    PhoneNumber = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drivers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RouteTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Earnings = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Vehicles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Brand = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Model = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    LicensePlate = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true),
                    DriverId = table.Column<Guid>(type: "TEXT", nullable: false),
                    AverageFuelConsumption = table.Column<double>(type: "REAL", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vehicles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vehicles_Drivers_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Drivers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FuelEntries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    DriverId = table.Column<Guid>(type: "TEXT", nullable: false),
                    VehicleId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    OdometerReading = table.Column<double>(type: "REAL", nullable: false),
                    Liters = table.Column<double>(type: "REAL", nullable: false),
                    IsFullTank = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    DistanceSinceLastRefuel = table.Column<double>(type: "REAL", nullable: true),
                    FuelConsumption = table.Column<double>(type: "REAL", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FuelEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FuelEntries_Drivers_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Drivers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FuelEntries_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RouteEntries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    DriverId = table.Column<Guid>(type: "TEXT", nullable: false),
                    VehicleId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RouteTypeId = table.Column<Guid>(type: "TEXT", nullable: false),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    StartOdometer = table.Column<double>(type: "REAL", nullable: false),
                    EndDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EndOdometer = table.Column<double>(type: "REAL", nullable: true),
                    TotalDistance = table.Column<double>(type: "REAL", nullable: true),
                    FuelUsed = table.Column<double>(type: "REAL", nullable: true),
                    Earnings = table.Column<decimal>(type: "TEXT", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RouteEntries_Drivers_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Drivers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RouteEntries_RouteTypes_RouteTypeId",
                        column: x => x.RouteTypeId,
                        principalTable: "RouteTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RouteEntries_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Drivers_IsActive",
                table: "Drivers",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Drivers_Name",
                table: "Drivers",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_FuelEntries_DriverId_Date",
                table: "FuelEntries",
                columns: new[] { "DriverId", "Date" });

            migrationBuilder.CreateIndex(
                name: "IX_FuelEntries_VehicleId_Date",
                table: "FuelEntries",
                columns: new[] { "VehicleId", "Date" });

            migrationBuilder.CreateIndex(
                name: "IX_RouteEntries_DriverId_StartDate",
                table: "RouteEntries",
                columns: new[] { "DriverId", "StartDate" });

            migrationBuilder.CreateIndex(
                name: "IX_RouteEntries_RouteTypeId",
                table: "RouteEntries",
                column: "RouteTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_RouteEntries_VehicleId_StartDate",
                table: "RouteEntries",
                columns: new[] { "VehicleId", "StartDate" });

            migrationBuilder.CreateIndex(
                name: "IX_RouteTypes_Name",
                table: "RouteTypes",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_Brand_Model",
                table: "Vehicles",
                columns: new[] { "Brand", "Model" });

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_DriverId",
                table: "Vehicles",
                column: "DriverId");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_LicensePlate",
                table: "Vehicles",
                column: "LicensePlate",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FuelEntries");

            migrationBuilder.DropTable(
                name: "RouteEntries");

            migrationBuilder.DropTable(
                name: "RouteTypes");

            migrationBuilder.DropTable(
                name: "Vehicles");

            migrationBuilder.DropTable(
                name: "Drivers");
        }
    }
}
