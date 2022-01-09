using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Foha.Models
{
    public partial class fohaIniContext : DbContext
    {
        public fohaIniContext()
        {
        }

        public fohaIniContext(DbContextOptions<fohaIniContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Cliente> Cliente { get; set; }
        public virtual DbSet<Colores> Colores { get; set; }
        public virtual DbSet<Empleado> Empleado { get; set; }
        public virtual DbSet<Etapa> Etapa { get; set; }
        public virtual DbSet<EtapaEmpleado> EtapaEmpleado { get; set; }
        public virtual DbSet<Sectores> Sectores { get; set; }
        public virtual DbSet<TipoEtapa> TipoEtapa { get; set; }
        public virtual DbSet<TipoTransfo> TipoTransfo { get; set; }
        public virtual DbSet<TipoUs> TipoUs { get; set; }
        public virtual DbSet<Transformadores> Transformadores { get; set; }
        public virtual DbSet<Usuario> Usuario { get; set; }
        public virtual DbSet<Vendedores> Vendedores { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=DESKTOP-4O7TAPT\\CHRIS;Database=fohaIni;Trusted_Connection=True;Integrated Security=true;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>(entity =>
            {
                entity.HasKey(e => e.IdCliente);

                entity.Property(e => e.IdCliente)
                    .HasColumnName("idCliente")
                    .ValueGeneratedNever();

                entity.Property(e => e.LegajoCli).HasColumnName("legajoCli");

                entity.Property(e => e.NombreCli)
                    .IsRequired()
                    .HasColumnName("nombreCli")
                    .HasMaxLength(150)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Colores>(entity =>
            {
                entity.HasKey(e => e.IdColor);

                entity.Property(e => e.IdColor)
                    .HasColumnName("idColor")
                    .ValueGeneratedNever();

                entity.Property(e => e.CodigoColor)
                    .IsRequired()
                    .HasColumnName("codigoColor")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Leyenda)
                    .HasColumnName("leyenda")
                    .HasMaxLength(200)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Empleado>(entity =>
            {
                entity.HasKey(e => e.IdEmpleado);

                entity.Property(e => e.IdEmpleado)
                    .HasColumnName("idEmpleado")
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .ValueGeneratedNever();

                entity.Property(e => e.IdSector).HasColumnName("idSector");

                entity.Property(e => e.Legajo)
                    .HasColumnName("legajo")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NombreEmp)
                    .IsRequired()
                    .HasColumnName("nombreEmp")
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.HasOne(d => d.IdSectorNavigation)
                    .WithMany(p => p.Empleado)
                    .HasForeignKey(d => d.IdSector)
                    .HasConstraintName("FK_Empleado_Sectores");
            });

            modelBuilder.Entity<Etapa>(entity =>
            {
                entity.HasKey(e => e.IdEtapa);

                entity.Property(e => e.IdEtapa).HasColumnName("idEtapa");

                entity.Property(e => e.DateFin)
                    .HasColumnName("dateFin")
                    .HasColumnType("datetime");

                entity.Property(e => e.DateIni)
                    .HasColumnName("dateIni")
                    .HasColumnType("datetime");

                entity.Property(e => e.FechaPausa)
                    .HasColumnName("fechaPausa")
                    .HasColumnType("datetime");

                entity.Property(e => e.Hora)
                    .HasColumnName("hora")
                    .HasMaxLength(10);

                entity.Property(e => e.IdColor).HasColumnName("idColor");

                entity.Property(e => e.IdEmpleado)
                    .HasColumnName("idEmpleado")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.IdTipoEtapa).HasColumnName("idTipoEtapa");

                entity.Property(e => e.IdTransfo).HasColumnName("idTransfo");

                entity.Property(e => e.InicioProceso)
                    .HasColumnName("inicioProceso")
                    .HasColumnType("datetime");

                entity.Property(e => e.IsEnded).HasColumnName("isEnded");

                entity.Property(e => e.NumEtapa).HasColumnName("numEtapa");

                entity.Property(e => e.TiempoFin)
                    .HasColumnName("tiempoFin")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TiempoParc)
                    .HasColumnName("tiempoParc")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.IdColorNavigation)
                    .WithMany(p => p.Etapa)
                    .HasForeignKey(d => d.IdColor)
                    .HasConstraintName("FK_Etapa_Colores");

                entity.HasOne(d => d.IdTipoEtapaNavigation)
                    .WithMany(p => p.Etapa)
                    .HasForeignKey(d => d.IdTipoEtapa)
                    .HasConstraintName("FK_Etapa_tipoEtapa");

                entity.HasOne(d => d.IdTransfoNavigation)
                    .WithMany(p => p.Etapa)
                    .HasForeignKey(d => d.IdTransfo)
                    .HasConstraintName("FK_Etapa_Transformadores");
            });

            modelBuilder.Entity<EtapaEmpleado>(entity =>
            {
                entity.HasKey(e => new { e.IdEtapa, e.IdEmpleado });

                entity.Property(e => e.IdEtapa).HasColumnName("idEtapa");

                entity.Property(e => e.IdEmpleado)
                    .HasColumnName("idEmpleado")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.DateFin)
                    .HasColumnName("dateFin")
                    .HasColumnType("datetime");

                entity.Property(e => e.DateIni)
                    .HasColumnName("dateIni")
                    .HasColumnType("datetime");

                entity.Property(e => e.IsEnded).HasColumnName("isEnded");

                entity.Property(e => e.TiempoFin)
                    .HasColumnName("tiempoFin")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TiempoParc)
                    .HasColumnName("tiempoParc")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.IdEmpleadoNavigation)
                    .WithMany(p => p.EtapaEmpleado)
                    .HasForeignKey(d => d.IdEmpleado)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_EtapaEmpleado_Empleado");

                entity.HasOne(d => d.IdEtapaNavigation)
                    .WithMany(p => p.EtapaEmpleado)
                    .HasForeignKey(d => d.IdEtapa)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_EtapaEmpleado_Etapa");
            });

            modelBuilder.Entity<Sectores>(entity =>
            {
                entity.HasKey(e => e.IdSector);

                entity.Property(e => e.IdSector).HasColumnName("idSector");

                entity.Property(e => e.NombreSector)
                    .IsRequired()
                    .HasColumnName("nombreSector")
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<TipoEtapa>(entity =>
            {
                entity.HasKey(e => e.IdTipoEtapa);

                entity.ToTable("tipoEtapa");

                entity.Property(e => e.IdTipoEtapa).HasColumnName("idTipoEtapa");

                entity.Property(e => e.Abrev)
                    .HasColumnName("abrev")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NombreEtapa)
                    .IsRequired()
                    .HasColumnName("nombreEtapa")
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.Orden).HasColumnName("orden");
            });

            modelBuilder.Entity<TipoTransfo>(entity =>
            {
                entity.HasKey(e => e.IdTipoTransfo);

                entity.Property(e => e.IdTipoTransfo).HasColumnName("idTipoTransfo");

                entity.Property(e => e.NombreTipoTransfo)
                    .IsRequired()
                    .HasColumnName("nombreTipoTransfo")
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<TipoUs>(entity =>
            {
                entity.HasKey(e => e.IdTipoUs);

                entity.Property(e => e.IdTipoUs)
                    .HasColumnName("idTipoUs")
                    .ValueGeneratedNever();

                entity.Property(e => e.TipoUs1)
                    .IsRequired()
                    .HasColumnName("tipoUs")
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Transformadores>(entity =>
            {
                entity.HasKey(e => e.IdTransfo);

                entity.Property(e => e.IdTransfo).HasColumnName("idTransfo");

                entity.Property(e => e.Anio).HasColumnName("anio");

                entity.Property(e => e.FechaCreacion)
                    .HasColumnName("fechaCreacion")
                    .HasColumnType("datetime");

                entity.Property(e => e.FechaPactada)
                    .HasColumnName("fechaPactada")
                    .HasColumnType("datetime");

                entity.Property(e => e.FechaProd)
                    .HasColumnName("fechaProd")
                    .HasColumnType("datetime");

                entity.Property(e => e.IdCliente).HasColumnName("idCliente");

                entity.Property(e => e.IdTipoTransfo).HasColumnName("idTipoTransfo");

                entity.Property(e => e.IdVendedor).HasColumnName("idVendedor");

                entity.Property(e => e.Lote).HasColumnName("lote");

                entity.Property(e => e.Mes).HasColumnName("mes");

                entity.Property(e => e.NombreCli)
                    .HasColumnName("nombreCli")
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.Nucleos)
                    .HasColumnName("nucleos")
                    .HasMaxLength(1)
                    .IsUnicode(false);

                entity.Property(e => e.OPe).HasColumnName("oPe");

                entity.Property(e => e.OTe).HasColumnName("oTe");

                entity.Property(e => e.Observaciones)
                    .HasColumnName("observaciones")
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Potencia).HasColumnName("potencia");

                entity.Property(e => e.Prioridad).HasColumnName("prioridad");

                entity.Property(e => e.RadPan)
                    .HasColumnName("radPan")
                    .HasMaxLength(2)
                    .IsUnicode(false);

                entity.Property(e => e.RangoFin).HasColumnName("rangoFin");

                entity.Property(e => e.RangoInicio).HasColumnName("rangoInicio");

                entity.Property(e => e.Serie).HasColumnName("serie");

                entity.HasOne(d => d.IdClienteNavigation)
                    .WithMany(p => p.Transformadores)
                    .HasForeignKey(d => d.IdCliente)
                    .HasConstraintName("FK_Transformadores_Cliente");

                entity.HasOne(d => d.IdTipoTransfoNavigation)
                    .WithMany(p => p.Transformadores)
                    .HasForeignKey(d => d.IdTipoTransfo)
                    .HasConstraintName("FK_Transformadores_TipoTransfo");

                entity.HasOne(d => d.IdVendedorNavigation)
                    .WithMany(p => p.Transformadores)
                    .HasForeignKey(d => d.IdVendedor)
                    .HasConstraintName("FK_Transformadores_Vendedores");
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.IdUser);

                entity.Property(e => e.IdUser).HasColumnName("idUser");

                entity.Property(e => e.IdSector).HasColumnName("idSector");

                entity.Property(e => e.IdTipoUs).HasColumnName("idTipoUs");

                entity.Property(e => e.NombreUs)
                    .IsRequired()
                    .HasColumnName("nombreUs")
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.Pass)
                    .IsRequired()
                    .HasColumnName("pass")
                    .HasMaxLength(128);

                entity.Property(e => e.RefreshToken)
                    .HasColumnName("refreshToken")
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.Salt)
                    .IsRequired()
                    .HasColumnName("salt")
                    .HasMaxLength(128);

                entity.HasOne(d => d.IdSectorNavigation)
                    .WithMany(p => p.Usuario)
                    .HasForeignKey(d => d.IdSector)
                    .HasConstraintName("FK_Usuario_Sectores");

                entity.HasOne(d => d.IdTipoUsNavigation)
                    .WithMany(p => p.Usuario)
                    .HasForeignKey(d => d.IdTipoUs)
                    .HasConstraintName("FK_Usuario_TipoUs");
            });

            modelBuilder.Entity<Vendedores>(entity =>
            {
                entity.HasKey(e => e.IdVendedor);

                entity.Property(e => e.IdVendedor)
                    .HasColumnName("idVendedor")
                    .ValueGeneratedNever();

                entity.Property(e => e.Abrev)
                    .HasColumnName("abrev")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Legajo)
                    .HasColumnName("legajo")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Mail)
                    .HasColumnName("mail")
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.Nombre)
                    .HasColumnName("nombre")
                    .HasMaxLength(150)
                    .IsUnicode(false);
            });
        }
    }
}
