using System.Collections.Generic;
using Foha.Models;

namespace Foha.Dtos
{
    public class OrderTrafoDto{
        public string Id { get; set; }
        public int Mes {get;set;}
        public int Anio {get;set;}
        public List<Transformadores> Lista { get; set; }

    }

}