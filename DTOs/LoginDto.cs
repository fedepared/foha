using System.ComponentModel.DataAnnotations;

namespace Foha.Dtos
{
    public class LoginDto
    {
        [Required]
        public string NombreUs { get; set; }
        [Required]
        public string Pass { get; set; }

        public string RefreshToken{get;set;}

        
    }
}