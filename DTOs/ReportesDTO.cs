using System;

namespace Foha.Dtos
{
    public class ReportesDTO{
        public int OPE { get; set; }
        public int? OTE { get; set; }
        public int Rango { get; set; }
        public string Proceso { get; set; }
        public int? RefProceso { get; set; }
        public DateTime? FechaIni { get; set; }
        public DateTime? FechaFin { get; set; }
        public string TiempoParc { get; set; }
        public string Operarios { get; set; }
        public int Potencia { get; set; }
        public string TipoTrafo { get; set; }
        public string Observacion { get; set; }

        public string ultimoUsuario { get; set; }     
        public DateTime? fechaUltimaModificacion { get; set; }


    }

}