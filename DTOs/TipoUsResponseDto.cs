using System;
using System.Collections.Generic;
using Foha.Models;

namespace Foha.Dtos
{
    public partial class TipoUsResponseDto
    {
        // public TipoUsDto()
        // {
        //     Usuario = new HashSet<Usuario>();
        // }

        public int IdTipoUs { get; set; }
        public string TipoUs1 { get; set; }

        public ICollection<Usuario> Usuario { get; set; }
    }
}