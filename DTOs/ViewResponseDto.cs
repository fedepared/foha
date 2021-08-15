using System;

namespace Foha.Dtos
{

    public class VistaTiemposParcResponseDto{
        public int IdTransfo { get; set; }
        public string OPe { get; set; }
        public int OTe { get; set; }
        public string Observaciones { get; set; }
        public int RangoInicio { get; set; }
        public int RangoFin { get; set; }
        public int? IdCliente { get; set; }
        public string NombreCli { get; set; }
        public int Potencia { get; set; }

        public int? IdTipoTransfo {get;set;}

        public DateTime Documentacion {get;set;}
        public string DocTiempoParc{get;set;}
        public DateTime BobinaBT1 {get;set;}
        public string BBT1TiempoParc {get;set;}
        public DateTime BobinaBT2 {get;set;}
        public string BBT2TiempoParc {get;set;}
        public DateTime BobinaBT3 {get;set;}
        public string BBT3TiempoParc {get;set;}
        public DateTime BobinaAT1 {get;set;}
        public string BAT1TiempoParc {get;set;}
        public DateTime BobinaAT2 {get;set;}
        public string BAT2TiempoParc {get;set;}
        public DateTime BobinaAT3 {get;set;}
        public string BAT3TiempoParc {get;set;}
        public DateTime BobinaRG1 {get;set;}
        public string BRG1TiempoParc {get;set;}
        public DateTime BobinaRG2 {get;set;}
        public string BRG2TiempoParc {get;set;}
        public DateTime BobinaRG3 {get;set;}
        public string BRG3TiempoParc {get;set;}
        public DateTime BobinaRF1 {get;set;}
        public string BRF1TiempoParc {get;set;}
        public DateTime BobinaRF2 {get;set;}
        public string BRF2TiempoParc {get;set;}
        public DateTime BobinaRF3 {get;set;}
        public string BRF3TiempoParc {get;set;}
        public DateTime EnsamblajeBobinas {get;set;}
        public string EnsBobTiempoParc {get;set;}
        public DateTime CorteYPlegadoPYS {get;set;}
        public string CYPTiempoParc {get;set;}
        public DateTime SoldaduraPYS {get;set;}
        public string SolTiempoParc {get;set;}
        public DateTime EnvioPYS {get;set;}
        public string EnvTiempoParc {get;set;}
        public DateTime Nucleo {get;set;}
        public string NucleoTiempoParc {get;set;}
        public DateTime Montaje {get;set;}
        public string MontajeTiempoParc {get;set;}
        public DateTime Horno {get;set;}
        public string HornoTiempoParc {get;set;}
        public DateTime CYPTapaCuba {get;set;}
        public string CYPTCTiempoParc {get;set;}
        public DateTime Tapa {get;set;}
        public string TapaTiempoParc {get;set;}
        public DateTime RadiadoresOPaneles {get;set;}
        public string ROPTiempoParc {get;set;}
        public DateTime Cuba {get;set;}
        public string CubaTiempoParc {get;set;}
        public DateTime TintasPenetrantes {get;set;}
        public string TPTiempoParc {get;set;}
        public DateTime Granallado {get;set;}
        public string GranalladoTiempoParc {get;set;}
        public DateTime Pintura {get;set;}
        public string PinturaTiempoParc {get;set;}
        public DateTime Encubado {get;set;}
        public string EncubadoTiempoParc {get;set;}
        public DateTime EnsayosRef {get;set;}
        public string ERefTiempoParc {get;set;}
        public DateTime Terminacion {get;set;}
        public string TerminacionTiempoParc {get;set;}
        public DateTime EnvioADeposito {get;set;}
        public string EADepTiempoParc {get;set;}
        public DateTime EnvioACliente {get;set;}
        public string EACliTiempoParc {get;set;}



    }
}