using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Foha.Models
{
    public partial class ObjectModel
    {
        
        public List<int> EtapasArr {get;set;}

        public List<int> TrafoNuevoArr { get; set; }
        public List<int> TrafoViejoArr { get; set; }
    }
}
