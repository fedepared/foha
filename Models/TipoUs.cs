using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Foha.Models
{
    public partial class TipoUs
    {
        public TipoUs()
        {
            Usuario = new HashSet<Usuario>();
        }

        public int IdTipoUs { get; set; }
        public string TipoUs1 { get; set; }
        [JsonIgnore]
        public ICollection<Usuario> Usuario { get; set; }
    }
}
