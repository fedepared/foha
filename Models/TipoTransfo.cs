using System;
using System.Collections.Generic;

namespace Foha.Models
{
    public partial class TipoTransfo
    {
        public TipoTransfo()
        {
            Transformadores = new HashSet<Transformadores>();
        }

        public int IdTipoTransfo { get; set; }
        public string NombreTipoTransfo { get; set; }

        public ICollection<Transformadores> Transformadores { get; set; }
    }
}
