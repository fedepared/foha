using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Foha.Models;
using Foha.Dtos;
using Foha.DTOs;
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
        public async Task<IActionResult> GetTipoEtapa()
        {
            var tipoEtapa =await _context.TipoEtapa.ToListAsync();
            List<int> order= new List<int>(){1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,33,34,18,19,35,36,37,20,21,23,43,24,25,26,27,38,39,22,40,41,42,28,29,44,30,31,45,32};
            tipoEtapa = tipoEtapa.OrderBy(d => order.IndexOf(d.IdTipoEtapa)).ToList();
            return Ok(tipoEtapa);
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

        [HttpGet("tipoEtapaPorSector/{idSector}")]
        public async Task<IActionResult> tipoEtapaPorSector([FromRoute] int idSector){
            Response<List<TipoEtapa>> r = new Response<List<TipoEtapa>>();
            List<TipoEtapa> allTipoEtapas = await _context.TipoEtapa.ToListAsync();
            int?[] Sector = new int?[] { 1 };
            switch(idSector){
                case 1:
                    Sector = new int?[] { 1 };
                    break;
                case 2:
                    Sector = new int?[] { 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 };
                    break;
                case 3:
                    Sector = new int?[] { 15, 16, 17, 21, 22, 23, 24, 25, 26, 27, 33, 34, 38, 39, 40, 41, 42, 43 };
                    break;
                case 4:
                    Sector = new int?[] { 18 };
                    break;
                case 5:
                    Sector = new int?[] { 19, 20, 35, 36 };
                    break;
                case 6:
                    Sector = new int?[] { 20 };
                    break;
                case 7:
                    Sector = new int?[] { 20, 28 };
                    break;
                case 8:
                    Sector = new int?[] { 29, 37, 44 };
                    break;
                case 9:
                    Sector = new int?[] { 30, 31, 32, 44 };
                    break;
                case 10:
                    Sector = new int?[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45 };
                    break;
                case 12:
                    Sector = new int?[] { 20, 28, 32 };
                    break;
                case 22:
                    Sector = new int?[] { 15, 21 };
                    break;
                case 23:
                    Sector = new int?[] { 16, 22, 24 };
                    break;
                case 24:
                    Sector = new int?[] { 22, 24, 25, 26, 40};
                    break;
                case 25:
                    Sector = new int?[] { 22,27 };
                    break;
                case 26:
                    Sector = new int?[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45 };
                    break;
            }
            List<TipoEtapa> etapasFiltradas = allTipoEtapas.Where(x => Sector.Contains(x.IdTipoEtapa)).ToList();
            r.Status = 200;
            r.Message = "Se realizo la consulta con exito.";
            r.Data = etapasFiltradas;
            return Ok(r);
        }


        private bool TipoEtapaExists(int id)
        {
            return _context.TipoEtapa.Any(e => e.IdTipoEtapa == id);
        }
    }
}