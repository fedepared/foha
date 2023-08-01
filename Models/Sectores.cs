using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Foha.Models
{
    public partial class Sectores
    {
        public Sectores()
        {
            Empleado = new HashSet<Empleado>();
            Usuario = new HashSet<Usuario>();
        }
        [Key]
        public int IdSector { get; set; }
        public string NombreSector { get; set; }

        public ICollection<Empleado> Empleado { get; set; }
        public ICollection<Usuario> Usuario { get; set; }
    }
}
