using System.Numerics;
using System;
using System.ComponentModel.DataAnnotations;
using Foha.Models;
using System.Collections.Generic;

namespace Foha.Dtos
{
    public class EtapaPorSectorDto{
        public long DesdeMili {get;set;}
        public long HastaMili {get;set;}
        public int IdSect {get;set;}
        public String idEmp {get;set;}
        public int idColor { get; set; }
    }
}