using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PhysioTech.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DeviceId1",
                table: "RentalDetails",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Devices",
                keyColumn: "Id",
                keyValue: 2,
                column: "Description",
                value: "Alternatywa dla kul.");

            migrationBuilder.UpdateData(
                table: "Devices",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Description", "Name" },
                values: new object[] { "Regulowane, składane, ergonomiczne kule amortyzujące wstrząsy.", "Kule Ergobaum" });

            migrationBuilder.UpdateData(
                table: "Devices",
                keyColumn: "Id",
                keyValue: 5,
                column: "Name",
                value: "Cold Recovery");

            migrationBuilder.CreateIndex(
                name: "IX_RentalDetails_DeviceId1",
                table: "RentalDetails",
                column: "DeviceId1");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalDetails_Devices_DeviceId1",
                table: "RentalDetails",
                column: "DeviceId1",
                principalTable: "Devices",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentalDetails_Devices_DeviceId1",
                table: "RentalDetails");

            migrationBuilder.DropIndex(
                name: "IX_RentalDetails_DeviceId1",
                table: "RentalDetails");

            migrationBuilder.DropColumn(
                name: "DeviceId1",
                table: "RentalDetails");

            migrationBuilder.UpdateData(
                table: "Devices",
                keyColumn: "Id",
                keyValue: 2,
                column: "Description",
                value: "ALternatywa dla kul");

            migrationBuilder.UpdateData(
                table: "Devices",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Description", "Name" },
                values: new object[] { "Kregulowane składane ergonomiczne amortyzujące wstrząsy kule.", "Kule Ergobaum " });

            migrationBuilder.UpdateData(
                table: "Devices",
                keyColumn: "Id",
                keyValue: 5,
                column: "Name",
                value: "Cold recovery");
        }
    }
}
