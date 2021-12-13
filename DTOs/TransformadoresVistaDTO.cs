using System;
using System.Collections.Generic;
using Foha.Models;

namespace Foha.Dtos
{

    public class TransformadoresVistaDTO
    {
        public string Encabezado { get; set; }
        public List<Transformadores> Trafos { get; set; }


    }
}