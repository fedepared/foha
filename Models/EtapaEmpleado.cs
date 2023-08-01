using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Foha.Models
{
    public partial class EtapaEmpleado
    {
        [Key]
        public int IdEtapa { get; set; }
        public string IdEmpleado { get; set; }
        public DateTime? DateIni { get; set; }
        public DateTime? DateFin { get; set; }
        public string TiempoParc { get; set; }
        public bool? IsEnded { get; set; }
        public string TiempoFin { get; set; }

        public Empleado IdEmpleadoNavigation { get; set; }
        public Etapa IdEtapaNavigation { get; set; }
    }
}
