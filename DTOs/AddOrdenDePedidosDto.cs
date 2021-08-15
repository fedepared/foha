using System;
using System.ComponentModel.DataAnnotations;

namespace Foha.Dtos
{

    public class AddOrdenDePedidosDto
    {
        [Required]
          public int IdOrden { get; set; }
        public string NombreOrden { get; set; }

        //public ICollection<Transformadores> Transformadores { get; set; }
    }
}