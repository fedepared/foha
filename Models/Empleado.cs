using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Foha.Models
{
    public partial class Empleado
    {
        public Empleado()
        {
            EtapaEmpleado = new HashSet<EtapaEmpleado>();
        }

        public string IdEmpleado { get; set; }
        public string NombreEmp { get; set; }
        public int? IdSector { get; set; }
        public string Legajo { get; set; }

        public Sectores IdSectorNavigation { get; set; }

        [JsonIgnore]
        public ICollection<EtapaEmpleado> EtapaEmpleado { get; set; }
    }
}
