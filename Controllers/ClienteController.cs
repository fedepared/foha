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
            var clientes =await _context.Cliente.OrderBy(x => x.NombreCli).ToArrayAsync();
            res.Data=clientes;
            res.Message="Ok";
            res.Status=200;
            return Ok(res);
        }

        // GET: api/ClientesNoStock
        
        [HttpGet("getClientesNoStock")]
        public async Task<IActionResult> GetClientesNoStock()
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
                    preCliente.IdCliente = _context.Cliente.Max(x => x.IdCliente) + 1;
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
            Response<ClienteResponseDto> r = new Response<ClienteResponseDto>();
            if (!ModelState.IsValid)
            {
                r.Status = 500;
                r.Message = "Datos incorrectos.";
                return BadRequest(r);
            }

            var cliente = await _context.Cliente.FindAsync(id);

            if (cliente == null)
            {
                r.Status = 404;
                r.Message = "No se encontro el cliente.";
                return NotFound(r);
            }

            ClienteResponseDto cli = new ClienteResponseDto();
            cli.IdCliente = cliente.IdCliente;
            cli.LegajoCli = cliente.LegajoCli.Value;
            cli.NombreCli = cliente.NombreCli;

            if(_context.Transformadores.Where(x => x.IdCliente == id).Count() > 0){
                r.Status = 500;
                r.Data = cli;
                r.Message = "El cliente contiene transformadores asociados.";
                return BadRequest(r);
                
            }

            try{
                _context.Cliente.Remove(cliente);
                await _context.SaveChangesAsync();
                r.Data = cli;
                r.Status = 200;
                r.Message = "Se borro el cliente exitosamente.";
                return Ok(r);
            }
            catch(Exception e){
                r.Status = 500;
                r.Message = e.Message;
                return BadRequest(r);
            }
        }

        private bool ClienteExists(int id,string nombreCli)
        {
            return _context.Cliente.Any(e => e.LegajoCli == id || e.NombreCli.Equals(nombreCli));
        }
    }
}