using System;
using System.ComponentModel.DataAnnotations;

namespace Foha.Dtos
{

    public class EditTipoEtapaDto
    {
        [Required]
        public int IdTipoEtapa { get; set; }
        public string NombreEtapa { get; set; }

        // public ICollection<Etapa> Etapa { get; set; }
    }
}