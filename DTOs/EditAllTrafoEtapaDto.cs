using System;
using System.ComponentModel.DataAnnotations;

namespace Foha.Dtos
{
    public class EditAllTrafoEtapaDto
    {
        public int[] ArrayTrafo {get;set;}

        public int[] IdTipoEtapa {get; set;}
        public int IdRef {get; set;}
    }
}