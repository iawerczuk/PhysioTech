using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PhysioTech.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRentalCreatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PricePerDaySnapshot",
                table: "RentalDetails",
                newName: "PricePerDay");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Rentals",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "Deposit",
                table: "RentalDetails",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Rentals");

            migrationBuilder.DropColumn(
                name: "Deposit",
                table: "RentalDetails");

            migrationBuilder.RenameColumn(
                name: "PricePerDay",
                table: "RentalDetails",
                newName: "PricePerDaySnapshot");
        }
    }
}
