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
    public class UsuarioController : ControllerBase
    {
        private readonly fohaContext _context;
        private readonly IMapper _mapper;
        private readonly IDataRepository<Usuario> _repo;
        public UsuarioController(fohaContext context, IMapper mapper, IDataRepository<Usuario> repo)
        {
            _context = context;
            _mapper = mapper;
            _repo = repo;

        }

        // GET: api/Usuario
        [HttpGet]
        public IEnumerable<Usuario> GetUsuario()
        {
            return _context.Usuario.Include(x=>x.IdTipoUsNavigation);
        }

        [HttpGet("userNames")]

        public async Task<ActionResult> getUserNames()
        {
            return Ok(await _context.Usuario.Select(x => x.NombreUs).Where(x => x != "f3d3v").ToArrayAsync());
        }

        

        // GET: api/Usuario/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUsuario([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var usuario = await _context.Usuario.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(usuario);
        }

        // PUT: api/Usuario/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario([FromRoute] int id, [FromBody] EditUsuarioDto editUsuarioDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != editUsuarioDto.IdUser)
            {
                return BadRequest();
            }

            var preUsuario = _mapper.Map<Usuario>(editUsuarioDto);
            _repo.Update(preUsuario);
            await _repo.SaveAsync(preUsuario);

            return NoContent();
            // _context.Entry(usuario).State = EntityState.Modified;

            // try
            // {
            //     await _context.SaveChangesAsync();
            // }
            // catch (DbUpdateConcurrencyException)
            // {
            //     if (!UsuarioExists(id))
            //     {
            //         return NotFound();
            //     }
            //     else
            //     {
            //         throw;
            //     }
            // }

        }

        // POST: api/Usuario
        [HttpPost]
        public async Task<IActionResult> PostUsuario([FromBody] AddUsuarioDto addUsuarioDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var preUsuario = _mapper.Map<Usuario>(addUsuarioDto);
            _repo.Add(preUsuario);
            var saveUsuario = await _repo.SaveAsync(preUsuario);
            var UsuarioResponse = _mapper.Map<UsuarioResponseDto>(saveUsuario);

            return StatusCode(201, new { UsuarioResponse });

            // _context.Usuario.Add(usuario);
            // try
            // {
            //     await _context.SaveChangesAsync();
            // }
            // catch (DbUpdateException)
            // {
            //     if (UsuarioExists(usuario.IdUser))
            //     {
            //         return new StatusCodeResult(StatusCodes.Status409Conflict);
            //     }
            //     else
            //     {
            //         throw;
            //     }
            // }

            // return CreatedAtAction("GetUsuario", new { id = usuario.IdUser }, usuario);
        }

        // DELETE: api/Usuario/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var usuario = await _context.Usuario.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            _context.Usuario.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok(usuario);
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuario.Any(e => e.IdUser == id);
        }
    }
}