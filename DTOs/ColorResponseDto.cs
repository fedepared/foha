using System;
using System.ComponentModel.DataAnnotations;

namespace Foha.Dtos
{
    public class ColorResponseDto
    {
        public int IdColor { get; set; }
        public string CodigoColor { get; set; }
        public string Leyenda {get; set; }

    }

}