using System.ComponentModel.DataAnnotations;

namespace Foha.Dtos
{
    public class LoggedDto
    {
        
        public int? IdTipoUs { get; set; }
        
        public int? Sector { get; set; }

        public string token{get;set;}

        
    }
}