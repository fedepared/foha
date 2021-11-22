using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Foha.Models;
using Foha.Repositories;
using AutoMapper;
using Foha.Dtos;
using Microsoft.AspNetCore.Authorization;


namespace Foha.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class EtapaEmpleadoController : ControllerBase
    {
        private readonly fohaIniContext _context;
        private readonly IMapper _mapper;
        private readonly IDataRepository<Cliente> _repo;
        public EtapaEmpleadoController(fohaIniContext context, IMapper mapper, IDataRepository<Cliente> repo)
        {
            _context = context;
            _mapper = mapper;
            _repo = repo;
        }

        // GET: api/EtapaEmpleado
        
        [HttpGet]
        public IEnumerable<EtapaEmpleado> GetEtapaEmpleado()
        {
            return _context.EtapaEmpleado;
        }

        // GET: api/EtapaEmpleado/5
        [HttpGet("{id}")]
        public IEnumerable<EtapaEmpleado> GetEtapaEmpleado([FromRoute] string id)
        {

            var etapaEmpleado =  _context.EtapaEmpleado
            .Where(empleado=>id==empleado.IdEmpleado)
            .Include(x=>x.IdEtapaNavigation)
            .ThenInclude(x=>x.IdTransfoNavigation)
            .Include(x=>x.IdEtapaNavigation)
            .ThenInclude(x=>x.IdTipoEtapaNavigation)
            .ToList();

            return etapaEmpleado;
        }

    }
}