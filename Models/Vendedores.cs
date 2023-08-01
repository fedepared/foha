using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Foha.Models
{
    public partial class Vendedores
    {
        public Vendedores()
        {
            Transformadores = new HashSet<Transformadores>();
        }
        [Key]
        public int IdVendedor { get; set; }
        public string Legajo { get; set; }
        public string Nombre { get; set; }
        public string Abrev { get; set; }
        public string Mail { get; set; }
        [JsonIgnore]
        public ICollection<Transformadores> Transformadores { get; set; }
    }
}
