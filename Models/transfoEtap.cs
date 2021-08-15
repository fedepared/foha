using System;
using System.Collections.Generic;

namespace Foha.Models
{
    public partial class TransfoEtap
    {
        public int IdEtapa { get; set; }
        public int IdTransfo { get; set; }

        public Etapa IdEtapaNavigation { get; set; }
        public Transformadores IdTransfoNavigation { get; set; }
    }
}
