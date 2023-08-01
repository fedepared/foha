using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Foha.Models
{
    public partial class Empleado
    {
        public Empleado()
        {
            EtapaEmpleado = new HashSet<EtapaEmpleado>();
        }
        [Key]
        public string IdEmpleado { get; set; }
        public string NombreEmp { get; set; }
        public int? IdSector { get; set; }
        public string Legajo { get; set; }

        public Sectores IdSectorNavigation { get; set; }

        [JsonIgnore]
        public ICollection<EtapaEmpleado> EtapaEmpleado { get; set; }
    }
}
