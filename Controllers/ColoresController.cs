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
    public class ColoresController : ControllerBase
    {
        private readonly fohaIniContext _context;
        private readonly IMapper _mapper;
        private readonly IDataRepository<Colores> _repo;
        public ColoresController(fohaIniContext context, IMapper mapper, IDataRepository<Colores> repo)
        {
            _context = context;
            _mapper = mapper;
            _repo = repo;
        }

        // GET: api/Colores
        [HttpGet]
        public IEnumerable<Colores> GetColores()
        {
            return _context.Colores;
        }

        // GET: api/Colores/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetColores([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var colores = await _context.Colores.FindAsync(id);

            if (colores == null)
            {
                return NotFound();
            }

            return Ok(colores);
        }

        // PUT: api/Colores/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutColor([FromRoute] int id, [FromBody] EditColorDto editColorDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != editColorDto.IdColor)
            {
                return BadRequest();
            }

            var preColor = _mapper.Map<Colores>(editColorDto);
            _repo.Update(preColor);
            await _repo.SaveAsync(preColor);

            return NoContent();


        }

        // POST: api/Color
        [HttpPost]
        public async Task<IActionResult> PostColor([FromBody] AddColorDto addColorDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            addColorDto.IdColor = _context.Colores.Count() > 0 ? _context.Colores.Max(x => x.IdColor) + 1 : 1;
            var preColor = _mapper.Map<Colores>(addColorDto);
            _repo.Add(preColor);
            try{
                var saveColor = await _repo.SaveAsync(preColor);
                var ColorResponse = _mapper.Map<ColorResponseDto>(saveColor);

                return StatusCode(201, new { ColorResponse });
            }
            catch(Exception ex)
            {
                return BadRequest(ex.InnerException);
            }

            
        }

        // DELETE: api/Color/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteColor([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var color = await _context.Colores.FindAsync(id);
            if (color == null)
            {
                return NotFound();
            }

            _context.Colores.Remove(color);
            await _context.SaveChangesAsync();

            return Ok(color);
        }

        private bool ColorExists(int id)
        {
            return _context.Colores.Any(e => e.IdColor == id);
        }
    }
}