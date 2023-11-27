using System;
using System.Collections.Generic;

namespace Foha.Models
{
    public partial class Usuario
    {
        public int IdUser { get; set; }
        public string NombreUs { get; set; }
        public byte[] Pass { get; set; }
        public byte[] Salt { get; set; }
        public int? IdSector { get; set; }
        public string RefreshToken { get; set; }
        public int? IdTipoUs { get; set; }

        public Sectores IdSectorNavigation { get; set; }
        public TipoUs IdTipoUsNavigation { get; set; }
    }
}
