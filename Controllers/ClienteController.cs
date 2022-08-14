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
using Foha.DTOs;

namespace Foha.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class ClienteController : ControllerBase
    {
        private readonly fohaIniContext _context;
        private readonly IMapper _mapper;
        private readonly IDataRepository<Cliente> _repo;
        public ClienteController(fohaIniContext context, IMapper mapper, IDataRepository<Cliente> repo)
        {
            _context = context;
            _mapper = mapper;
            _repo = repo;
        }

        // GET: api/Cliente
        
        [HttpGet]
        public async Task<IActionResult> GetCliente()
        {
            var res = new Response<Cliente[]>();
            var clientes =await _context.Cliente.Where(x => x.LegajoCli != 9999).OrderBy(x => x.NombreCli).ToArrayAsync();
            
            res.Data=clientes;
            res.Message="Ok";
            res.Status=200;
            return Ok(res);
        }

        // GET: api/Cliente/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCliente([FromRoute] int id)
        {
            Response<ClienteResponseDto> res = new Response<ClienteResponseDto>();
            var cliente = _mapper.Map<ClienteResponseDto>(await _context.Cliente.FindAsync(id));

            if (cliente == null)
            {
                res.Message="No encontrado";
                res.Status =404;
                return NotFound(res);
            }else{
                res.Message = "Ok";
                res.Data = cliente;
                res.Status = 200;
                return Ok(res);
            }
            
        }

        // PUT: api/Cliente/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente([FromRoute] int id, [FromBody] ClienteResponseDto editCliente)
        {
            Response<ClienteResponseDto> res = new Response<ClienteResponseDto>();
            
            if (!ModelState.IsValid)
            {
                res.Data = editCliente;
                res.Message="Error en la carga de datos";
                res.Status= 409;
                return BadRequest(res);
            }

            if (id != editCliente.IdCliente)
            {
                res.Data = editCliente;
                res.Message="Los datos son incorrectos";
                res.Status= 409;
                return BadRequest(res);
            }

            if(_context.Cliente.Any(x=>x.IdCliente!=editCliente.IdCliente && x.LegajoCli.Equals(editCliente.LegajoCli))) //Probar si se puede editar el nombre
            {
                res.Message="Ya existe un cliente con ese legajo asignado";
                res.Status= 409;
                return BadRequest(res);
            }

            var preCliente = _mapper.Map<Cliente>(editCliente);
            _repo.Update(preCliente);
            try{
                    await _context.SaveChangesAsync();
                    res.Data=editCliente;
                    res.Message="Ok";
                    res.Status=200;
                    return Ok(res);
                }catch(DbUpdateConcurrencyException ex) {
                    res.Data=null;
                    res.Message = ex.InnerException.Message.ToString();
                    res.Status=500;
                    return BadRequest(res);
                }
            
        }

        // POST: api/Cliente
        [HttpPost]
        public async Task<IActionResult> PostCliente([FromBody] ClienteResponseDto addCliente)
        {
            Response<ClienteResponseDto> res = new Response<ClienteResponseDto>();

            if (!ModelState.IsValid)
            {
                res.Status=400;
                res.Message = "Datos erróneos";
                return BadRequest(res);
            }

            var preCliente = _mapper.Map<Cliente>(addCliente);

            if(ClienteExists(addCliente.LegajoCli,addCliente.NombreCli))
            {
                res.Message = "Ya existe un empleado con ese id o ese nombre";
                res.Status =409; 
                return BadRequest(res);
            }else{
                try
                {
                    _repo.Add(preCliente);
                    var saveCliente = await _repo.SaveAsync(preCliente);
                    await _context.SaveChangesAsync();
                    var clienteResponse = _mapper.Map<ClienteResponseDto>(saveCliente);
                    res.Data=clienteResponse;
                    res.Message="Created";
                    res.Status = 201;
                    return Ok(res);
                }
                catch(Exception ex)
                {
                    res.Message=ex.ToString();
                    res.Status=400;
                    return BadRequest(res);
                }
            }

            // var preCliente = _mapper.Map<Cliente>(addClienteDto);
            // _repo.Add(preCliente);
            // var saveCliente = await _repo.SaveAsync(preCliente);
            // var ClienteResponse = _mapper.Map<ClienteResponseDto>(saveCliente);

        }

        // DELETE: api/Cliente/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cliente = await _context.Cliente.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            _context.Cliente.Remove(cliente);
            await _context.SaveChangesAsync();

            return Ok(cliente);
        }

        private bool ClienteExists(int id,string nombreCli)
        {
            return _context.Cliente.Any(e => e.IdCliente == id || e.NombreCli.Equals(nombreCli));
        }
    }
}