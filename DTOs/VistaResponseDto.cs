using System;

namespace Foha.Dtos
{

    public class VistaResponseDto
    {
            public int IdTransfo { get; set; }

            public string OPe{get;set;}
            public int OTe{get;set;} 
            public string Observaciones{get;set;}
            public int RangoInicio{get;set;}
            public int RangoFin{get;set;} 
            public string NombreCli{get;set;}
            public int Potencia{get;set;} 

            public DateTime? Documentacion{get;set;} 
            public DateTime? BobinaBT1{get;set;} 
            public DateTime? BobinaBT2{get;set;} 
            public DateTime? BobinaBT3{get;set;} 
            public DateTime? BobinaAT1{get;set;} 
            public DateTime? BobinaAT2{get;set;} 
            public DateTime? BobinaAT3{get;set;} 
            public DateTime? BobinaRG1{get;set;} 
            public DateTime? BobinaRG2{get;set;} 
            public DateTime? BobinaRG3{get;set;} 
            public DateTime? BobinaRF1{get;set;} 
            public DateTime? BobinaRF2{get;set;} 
            public DateTime? BobinaRF3{get;set;} 
            public DateTime? EnsamblajeBobinas{get;set;} 
            public DateTime? CorteYPlegadoPYS{get;set;} 
            public DateTime? SoldaduraPYS{get;set;} 
            public DateTime? EnvioPYS{get;set;} 
            public DateTime? Nucleo{get;set;} 
            public DateTime? Montaje{get;set;} 
            public DateTime? Horno{get;set;} 
            public DateTime? CYPTapaCuba{get;set;} 
            public DateTime? Tapa{get;set;} 
            public DateTime? RadiadoresOPaneles{get;set;} 
            public DateTime? Cuba{get;set;} 
            public DateTime? TintasPenetrantes{get;set;} 
            public DateTime? Granallado{get;set;} 
            public DateTime? Pintura{get;set;} 
            public DateTime? Encubado{get;set;} 
            public DateTime? EnsayosRef{get;set;} 
            public DateTime? Terminacion{get;set;} 
            public DateTime? EnvioADeposito{get;set;} 
            public DateTime? EnvioACliente{get;set;} 
    }
}