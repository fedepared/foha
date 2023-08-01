using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Foha.Models
{
    public partial class TipoTransfo
    {
        public TipoTransfo()
        {
            Transformadores = new HashSet<Transformadores>();
        }
        [Key]
        public int IdTipoTransfo { get; set; }
        public string NombreTipoTransfo { get; set; }

        public ICollection<Transformadores> Transformadores { get; set; }
    }
}
