using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Foha.Models
{
    public partial class TipoEtapa
    {
        public TipoEtapa()
        {
            Etapa = new HashSet<Etapa>();
        }

        public int IdTipoEtapa { get; set; }
        public string NombreEtapa { get; set; }
        public int? Orden { get; set; }
        public string Abrev { get; set; }

        [JsonIgnore]
        public ICollection<Etapa> Etapa { get; set; }
    }
}
