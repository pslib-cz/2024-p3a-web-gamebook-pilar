﻿// <auto-generated />
using System;
using GamebookPilar.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace GamebookPilar.Server.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250204100039_final")]
    partial class final
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.11");

            modelBuilder.Entity("GamebookPilar.Server.Models.Background", b =>
                {
                    b.Property<int>("BackgroundId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("HasItem")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ImageUrl")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsLit")
                        .HasColumnType("INTEGER");

                    b.Property<int>("LocationId")
                        .HasColumnType("INTEGER");

                    b.HasKey("BackgroundId");

                    b.HasIndex("LocationId");

                    b.ToTable("Backgrounds");
                });

            modelBuilder.Entity("GamebookPilar.Server.Models.Location", b =>
                {
                    b.Property<int>("LocationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ContainedItem")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsCutscene")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsLit")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ItemIndex")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Monologue")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("SwitchIndex")
                        .HasColumnType("INTEGER");

                    b.HasKey("LocationId");

                    b.ToTable("Locations");
                });

            modelBuilder.Entity("GamebookPilar.Server.Models.MoveButton", b =>
                {
                    b.Property<int>("MoveButtonId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsCandle")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsPage")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("KeyIndex")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Label")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("LocationId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("LocationX")
                        .HasColumnType("INTEGER");

                    b.Property<int>("LocationY")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Pin")
                        .HasColumnType("TEXT");

                    b.Property<bool>("StaminaFree")
                        .HasColumnType("INTEGER");

                    b.Property<int>("TargetLocationId")
                        .HasColumnType("INTEGER");

                    b.HasKey("MoveButtonId");

                    b.HasIndex("LocationId");

                    b.ToTable("MoveButtons");
                });

            modelBuilder.Entity("GamebookPilar.Server.Models.Status", b =>
                {
                    b.Property<int>("StatusId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("ImageUrl")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("SanityIndex")
                        .HasColumnType("INTEGER");

                    b.HasKey("StatusId");

                    b.ToTable("Statuses");
                });

            modelBuilder.Entity("GamebookPilar.Server.Models.Switch", b =>
                {
                    b.Property<int>("SwitchId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("LocationId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("LocationX")
                        .HasColumnType("INTEGER");

                    b.Property<int>("LocationY")
                        .HasColumnType("INTEGER");

                    b.Property<int>("SwitchIndex")
                        .HasColumnType("INTEGER");

                    b.Property<int>("TargetLocationId")
                        .HasColumnType("INTEGER");

                    b.HasKey("SwitchId");

                    b.HasIndex("LocationId");

                    b.ToTable("Switches");
                });

            modelBuilder.Entity("GamebookPilar.Server.Models.Background", b =>
                {
                    b.HasOne("GamebookPilar.Server.Models.Location", "Location")
                        .WithMany("Backgrounds")
                        .HasForeignKey("LocationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Location");
                });

            modelBuilder.Entity("GamebookPilar.Server.Models.MoveButton", b =>
                {
                    b.HasOne("GamebookPilar.Server.Models.Location", "Location")
                        .WithMany("MoveButtons")
                        .HasForeignKey("LocationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Location");
                });

            modelBuilder.Entity("GamebookPilar.Server.Models.Switch", b =>
                {
                    b.HasOne("GamebookPilar.Server.Models.Location", "Location")
                        .WithMany("Switches")
                        .HasForeignKey("LocationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Location");
                });

            modelBuilder.Entity("GamebookPilar.Server.Models.Location", b =>
                {
                    b.Navigation("Backgrounds");

                    b.Navigation("MoveButtons");

                    b.Navigation("Switches");
                });
#pragma warning restore 612, 618
        }
    }
}
