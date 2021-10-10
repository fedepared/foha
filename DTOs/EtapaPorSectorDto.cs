using System;
using System.ComponentModel.DataAnnotations;
using Foha.Models;
using System.Collections.Generic;

namespace Foha.Dtos
{
    public class EtapaPorSectorDto{
        int DesdeMili {get;set;}
        int HastaMili {get;set;}
        int IdSect {get;set;}
        String idEmp {get;set;}
    }
}