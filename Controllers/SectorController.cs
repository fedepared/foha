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


namespace Foha.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SectoresController: ControllerBase 
    {
        private readonly fohaContext _context;
        private readonly IMapper _mapper;
        private readonly IDataRepository<TipoEtapa> _repo;

        public SectoresController(fohaContext context, IMapper mapper, IDataRepository<TipoEtapa> repo)
        {
            _context = context;
            _mapper = mapper;
            _repo = repo;
        }

        // GET: api/Sectores
        [HttpGet]
        public IEnumerable<Sectores> GetSectores()
        {
            return _context.Sectores;
        }

        // GET: api/Sector/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSector([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sector = await _context.Sectores.FindAsync(id);

            if (sector == null)
            {
                return NotFound();
            }

            return Ok(sector);
        } 
    }
}