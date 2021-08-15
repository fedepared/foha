using System;
using System.ComponentModel.DataAnnotations;
using Foha.Models;

namespace Foha.Dtos
{

public partial class AddTransformadoresDto
    {
        
        // public TransformadoresResponseDto()
        // {
        //     Etapa = new HashSet<Etapa>();
        // }

        public int IdTransfo { get; set; }
        public int OPe { get; set; }
        public int? OTe { get; set; }
        public string Observaciones { get; set; }
        public int? RangoInicio { get; set; }
        public int? RangoFin { get; set; }
        public int? IdCliente { get; set; }
        public string NombreCli { get; set; }
        public int Potencia { get; set; }
        public int? IdTipoTransfo { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public int? Mes { get; set; }
        public int? Anio { get; set; }
        public int? Prioridad { get; set; }
        public DateTime? FechaPactada { get; set; }
        public DateTime? FechaProd { get; set; }
        public string Nucleos { get; set; }
        public int? Lote { get; set; }
        public string RadPan { get; set; }

        

        // public Cliente IdClienteNavigation { get; set; }
        // public TipoTransfo IdTipoTransfoNavigation { get; set; }
        // public ICollection<Etapa> Etapa { get; set; }
    }
}