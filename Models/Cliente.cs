using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Foha.Models
{
    public partial class Cliente
    {
        public Cliente()
        {
            Transformadores = new HashSet<Transformadores>();
        }
        [Key]
        public int IdCliente { get; set; }
        public string NombreCli { get; set; }
        public int? LegajoCli { get; set; }
        [JsonIgnore]
        public ICollection<Transformadores> Transformadores { get; set; }
    }
}
