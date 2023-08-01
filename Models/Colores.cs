using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Foha.Models
{
    public partial class Colores
    {
        public Colores()
        {
            Etapa = new HashSet<Etapa>();
        }
        [Key]
        public int IdColor { get; set; }
        public string CodigoColor { get; set; }
        public string Leyenda { get; set; }
        [JsonIgnore]
        public ICollection<Etapa> Etapa { get; set; }
    }
}
