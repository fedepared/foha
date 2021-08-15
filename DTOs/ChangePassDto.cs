using System;
using System.Collections.Generic;
using Foha.Models;

namespace Foha.Dtos
{

    public class ChangePassDto{
        public string NombreUs { get; set; }
        public string Pass {get; set;}

        public string ConfirmPass {get;set; }
    }

}