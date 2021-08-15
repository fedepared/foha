using System;
using System.ComponentModel.DataAnnotations;

namespace Foha.Dtos
{
    public class EditOrdenDePedidosDto{
        [Required]
        public int IdOrden { get; set; }
        public string NombreOrden { get; set; }

        //public ICollection<Transformadores> Transformadores { get; set; }

    }

}