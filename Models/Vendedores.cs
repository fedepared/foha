using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Foha.Models
{
    public partial class Vendedores
    {
        public Vendedores()
        {
            Transformadores = new HashSet<Transformadores>();
        }

        public int IdVendedor { get; set; }
        public string Legajo { get; set; }
        public string Nombre { get; set; }
        public string Abrev { get; set; }
        public string Mail { get; set; }
        [JsonIgnore]
        public ICollection<Transformadores> Transformadores { get; set; }
    }
}
