using System.ComponentModel.DataAnnotations;
using Foha.Models;

namespace Foha.Dtos
{
    public class RegisterDto
    {
        [Required]
        [StringLength(150, MinimumLength = 3, ErrorMessage = "El nombre debe tener al menos 3 caracteres")]
        public string nombreUs { get; set; }
        [Required]
        [StringLength(64, MinimumLength = 8, ErrorMessage = "Su contraseña debe tener entre 8 y 64 caracteres")]
        public string pass { get; set; }
        [Required]
        public int idTipoUs {get;set;}

        public int idSector { get; set; }


    }
}