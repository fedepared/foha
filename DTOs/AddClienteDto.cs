using System;
using System.ComponentModel.DataAnnotations;

namespace Foha.Dtos
{
    public class AddClienteDto
    {
        public int IdCliente { get; set; }
        
        public string NombreCli { get; set; }
        
    }
}