namespace Foha.Dtos
{

    public class EmpleadoResponseDto
    {
        
        public string IdEmpleado { get; set; }
        public string NombreEmp { get; set; }
        public int IdSector {get;set;}

        public string Legajo {get;set;}
        

        // public ICollection<Usuario> Usuario { get; set; }
    }
}