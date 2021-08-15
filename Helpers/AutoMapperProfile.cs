using Foha.Dtos;
using Foha.Models;
using AutoMapper;

namespace Foha.Helpers
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AddClienteDto,Cliente >();
            CreateMap<EditClienteDto, Cliente>();
            CreateMap<ClienteResponseDto, Cliente>();
            CreateMap<EmpleadoResponseDto,Empleado>();
            CreateMap<AddEtapaDto, Etapa>(MemberList.Source);
            CreateMap<EditEtapaDto, Etapa>();
            CreateMap<EtapaResponseDto,Etapa>(MemberList.Source);
            CreateMap<AddColorDto, Colores>();
            CreateMap<EditColorDto, Colores>();
            CreateMap<ColorResponseDto, Colores>();
            CreateMap<AddTipoEtapaDto, TipoEtapa>();
            CreateMap<EditTipoEtapaDto, TipoEtapa>();
            CreateMap<TipoEtapaResponseDto, TipoEtapa>();
            CreateMap<AddTransformadoresDto, Transformadores>(MemberList.Source);
            CreateMap<EditTransformadoresDto, Transformadores>();
            CreateMap<TransformadoresResponseDto, Transformadores>(MemberList.Source);
            CreateMap<AddUsuarioDto, Usuario>();
            CreateMap<EditUsuarioDto, Usuario>();
            CreateMap<UsuarioResponseDto, Usuario>();
            CreateMap<LoginDto,Usuario>();
            CreateMap<RegisterDto,Usuario>();
            CreateMap<VistaResponseDto, MegaUltraArchiVista>();
            CreateMap<TipoTransfoResponseDto, TipoTransfo>();
            CreateMap<VistaTiemposParcResponseDto,VistaTiemposParc>();
            CreateMap<AddEtapaEmpleadoDto,EtapaEmpleado>();
            CreateMap<EtapaEmpleadoResponseDto,EtapaEmpleado>();
            CreateMap<EditEtapaDto,EtapaEmpleadoResponseDto>();
            CreateMap<TipoUsResponseDto,TipoUs>();
            CreateMap<RegisterResponseDto,Usuario>();

        }
    }
}