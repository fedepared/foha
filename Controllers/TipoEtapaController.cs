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
    public class TipoEtapaController : ControllerBase
    {
        private readonly fohaIniContext _context;
        private readonly IMapper _mapper;
        private readonly IDataRepository<TipoEtapa> _repo;

        public TipoEtapaController(fohaIniContext context, IMapper mapper, IDataRepository<TipoEtapa> repo)
        {
            _context = context;
            _mapper = mapper;
            _repo = repo;
        }

        // GET: api/TipoEtapa
        [HttpGet]
        public IEnumerable<TipoEtapa> GetTipoEtapa()
        {
            return _context.TipoEtapa;
        }

        // GET: api/TipoEtapa/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTipoEtapa([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tipoEtapa = await _context.TipoEtapa.FindAsync(id);

            if (tipoEtapa == null)
            {
                return NotFound();
            }

            return Ok(tipoEtapa);
        }

        // PUT: api/TipoEtapa/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipoEtapa([FromRoute] int id, [FromBody] EditTipoEtapaDto editTipoEtapaDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != editTipoEtapaDto.IdTipoEtapa)
            {
                return BadRequest();
            }

            var preTipoEtapa = _mapper.Map<TipoEtapa>(editTipoEtapaDto);
            _repo.Update(preTipoEtapa);
            await _repo.SaveAsync(preTipoEtapa);

            return NoContent();
            // _context.Entry(tipoEtapa).State = EntityState.Modified;

            // try
            // {
            //     await _context.SaveChangesAsync();
            // }
            // catch (DbUpdateConcurrencyException)
            // {
            //     if (!TipoEtapaExists(id))
            //     {
            //         return NotFound();
            //     }
            //     else
            //     {
            //         throw;
            //     }
            // }

        }

        // POST: api/TipoEtapa
        [HttpPost]
        public async Task<IActionResult> PostTipoEtapa([FromBody] AddTipoEtapaDto addTipoEtapaDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var preTipoEtapa = _mapper.Map<TipoEtapa>(addTipoEtapaDto);
            _repo.Add(preTipoEtapa);
            var saveTipoEtapa = await _repo.SaveAsync(preTipoEtapa);
            var TipoEtapaResponse = _mapper.Map<TipoEtapaResponseDto>(saveTipoEtapa);

            return StatusCode(201, new { TipoEtapaResponse });

            // _context.TipoEtapa.Add(tipoEtapa);
            // try
            // {
            //     await _context.SaveChangesAsync();
            // }
            // catch (DbUpdateException)
            // {
            //     if (TipoEtapaExists(tipoEtapa.IdTipoEtapa))
            //     {
            //         return new StatusCodeResult(StatusCodes.Status409Conflict);
            //     }
            //     else
            //     {
            //         throw;
            //     }
            // }

            // return CreatedAtAction("GetTipoEtapa", new { id = tipoEtapa.IdTipoEtapa }, tipoEtapa);
        }

        // DELETE: api/TipoEtapa/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTipoEtapa([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tipoEtapa = await _context.TipoEtapa.FindAsync(id);
            if (tipoEtapa == null)
            {
                return NotFound();
            }

            _context.TipoEtapa.Remove(tipoEtapa);
            await _context.SaveChangesAsync();

            return Ok(tipoEtapa);
        }

        private bool TipoEtapaExists(int id)
        {
            return _context.TipoEtapa.Any(e => e.IdTipoEtapa == id);
        }
    }
}