using System;
using System.Collections.Generic;

namespace Foha.Models
{
    public partial class Sectores
    {
        public Sectores()
        {
            Empleado = new HashSet<Empleado>();
            Usuario = new HashSet<Usuario>();
        }

        public int IdSector { get; set; }
        public string NombreSector { get; set; }

        public ICollection<Empleado> Empleado { get; set; }
        public ICollection<Usuario> Usuario { get; set; }
    }
}
