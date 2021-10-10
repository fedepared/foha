using System.Collections.Generic;
using Foha.Models;

namespace Foha.Dtos
{
    public class OrderTrafoDto{
        public string Id { get; set; }
        public List<Transformadores> Lista { get; set; }

    }

}