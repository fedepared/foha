using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Foha.Models;
using Foha.Dtos;
using Foha.Repositories;
using AutoMapper;
using System.Collections;

namespace Foha.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ViewController : ControllerBase
    {
        private readonly fohaContext _context;
        private readonly IMapper _mapper;
        private readonly IDataRepository<VistaTiemposParc> _repo;

        public ViewController(fohaContext context, IMapper mapper, IDataRepository<VistaTiemposParc> repo)
        {
            _context = context;
            _mapper = mapper;
            _repo = repo;
        }

        // [HttpGet]
        // public IEnumerable<VistaTiemposParc> GetView()
        // {
            // return _context.VistaTiemposParc.OrderByDescending(z=>z.Anio).ThenByDescending(z=>z.Mes).ThenBy(x=>x.Prioridad);
            //cambiar <object> por <VistaTiemposParc>
            // var vistaOrdenada=_context.VistaTiemposParc.OrderByDescending(z=>z.Anio).ThenByDescending(z=>z.Mes).ThenBy(x=>x.Prioridad).ToList();

            // List<List<VistaTiemposParc>> vistaSegmentada = new List<List<VistaTiemposParc>>();
            // // la papa
            // List<VistaTiemposParc> vistaPorMesAnio = new List<VistaTiemposParc>();
            // VistaTiemposParc ultimaVistaAgregada = null;
            // foreach (VistaTiemposParc vista in vistaOrdenada)
            // {
            //     // si no es el primero y es de otro mes o año que el anterior entonces agrego la lista y empiezo una nueva
            //     if (ultimaVistaAgregada != null && (ultimaVistaAgregada.Anio != vista.Anio || ultimaVistaAgregada.Mes != vista.Mes))
            //     {
            //     vistaSegmentada.Add(vistaPorMesAnio);
            //     vistaPorMesAnio = new List<VistaTiemposParc>();
            //     }

                        
            //     vistaPorMesAnio.Add(vista);
            //     ultimaVistaAgregada = vista;
            // }
            
            // // agregamos los ultimos que quedan colgados
            
            // vistaSegmentada.Add(vistaPorMesAnio);
            // return vistaSegmentada;
        //}

    }
}