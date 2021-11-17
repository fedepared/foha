using System;
using System.Collections.Generic;

namespace Foha.Models
{
    public partial class Etapa
    {
        public Etapa()
        {
            EtapaEmpleado = new HashSet<EtapaEmpleado>();
        }

        public int IdEtapa { get; set; }
        public int? IdTipoEtapa { get; set; }
        public DateTime? DateIni { get; set; }
        public DateTime? DateFin { get; set; }
        public bool? IsEnded { get; set; }
        public string TiempoParc { get; set; }
        public string TiempoFin { get; set; }
        public int? IdTransfo { get; set; }
        public string IdEmpleado { get; set; }
        public string Hora { get; set; }
        public DateTime? InicioProceso { get; set; }
        public int? IdColor { get; set; }
        public int? NumEtapa { get; set; }
        public DateTime? FechaPausa { get; set; }

        public Colores IdColorNavigation { get; set; }
        public TipoEtapa IdTipoEtapaNavigation { get; set; }
        public Transformadores IdTransfoNavigation { get; set; }
        public ICollection<EtapaEmpleado> EtapaEmpleado { get; set; }
    }
}
