using System.IO.Compression;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Foha.Models;
using Foha.Dtos;
using AutoMapper;
using Foha.Repositories;
using Foha.DTOs;

namespace Foha.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadoController : ControllerBase
    {
        private readonly fohaContext _context;
        private readonly IMapper _mapper;
        private readonly IDataRepository<Empleado> _repo;
        public EmpleadoController(fohaContext context, IMapper mapper, IDataRepository<Empleado> repo)
        {
            _context = context;
            _mapper = mapper;
            _repo = repo;
        }

        // GET: api/Empleado
        [HttpGet]
        public async Task<IActionResult> GetEmpleado()
        {
            var res = new Response<Empleado[]>();
            var empleados = await _context.Empleado.OrderBy(x=>x.NombreEmp).Include(x=>x.IdSectorNavigation).Where(x=>x.IdSector!=11).ToArrayAsync();
            res.Data=empleados;
            res.Message="Ok";
            res.Status=200;
            
            return Ok(res);
        }

        // GET: api/Empleado/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmpleado([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var empleado = await _context.Empleado.FindAsync(id);
            

            if (empleado == null)
            {
                return NotFound();
            }

            return Ok(empleado);
        }

        
        // PUT: api/Empleado/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmpleado([FromRoute] string id, [FromBody] EmpleadoResponseDto editEmpleadoDto)
        {
            
            Response<EmpleadoResponseDto> res = new Response<EmpleadoResponseDto>();
            
            if (!ModelState.IsValid)
            {
                res.Data = editEmpleadoDto;
                res.Message="Error en la carga de datos";
                res.Status= 409;
                return BadRequest(res);
            }

            if (id != editEmpleadoDto.IdEmpleado)
            {
                res.Data = editEmpleadoDto;
                res.Message="Los datos son incorrectos";
                res.Status= 409;
                return BadRequest(res);
            }

            if(_context.Empleado.Any(x=>x.IdEmpleado==editEmpleadoDto.Legajo && !x.NombreEmp.Equals(editEmpleadoDto.NombreEmp)))
            {
                res.Message="Ya existe un empleado con ese legajo asignado";
                res.Status= 409;
                return BadRequest(res);
            }

            var preEmpleado = _mapper.Map<Empleado>(editEmpleadoDto);
            _repo.Update(preEmpleado);
            try{
                    await _context.SaveChangesAsync();
                    res.Data=editEmpleadoDto;
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

        // POST: api/Empleado
        [HttpPost]
        public async Task<IActionResult> PostEmpleado([FromBody] EmpleadoResponseDto addEmpleadoDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var res = new Response<EmpleadoResponseDto>();
            var preEmpleado = _mapper.Map<Empleado>(addEmpleadoDto);
            
            
            if(EmpleadoExists(preEmpleado)){
                res.Message="Ya existe un usuario con el mismo nombre/legajo asignado";
                res.Status=409;
                return BadRequest(res);
            }
            else{
                try
                {
                    _repo.Add(preEmpleado);
                    var saveEmpleado = await _repo.SaveAsync(preEmpleado);
                    await _context.SaveChangesAsync();
                    var EmpleadoResponse = _mapper.Map<EmpleadoResponseDto>(saveEmpleado);
                    res.Data=EmpleadoResponse;
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
        }

        // DELETE: api/Empleado/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmpleado([FromRoute] string id)
        {
            var res = new Response<EmpleadoResponseDto>();
            if (!ModelState.IsValid)
            {
                res.Message="Datos incorrectos";
                res.Status=409;
                return BadRequest(res);
            }

            var empleado = await _context.Empleado.FindAsync(id);
            
            if (empleado == null)
            {
                res.Message ="No encontrado";
                res.Status=404;
                return NotFound(res);
            }

            if(_context.EtapaEmpleado.Where(x => x.IdEmpleado == empleado.IdEmpleado).Count() > 0){
                res.Message="El empleado está asignado a un proceso";
                res.Status=400;
                return BadRequest(res);
            }
            try{
                _context.Empleado.Remove(empleado);
                await _context.SaveChangesAsync();
                res.Message="Empleado borrado con éxito";
                res.Status = 200;
                return Ok(res);
            }
            catch(Exception ex){
                res.Message=ex.ToString();
                res.Status=500;
                return BadRequest(res);
            }
        }

        private bool EmpleadoExists(Empleado emp)
        {
            return _context.Empleado.Any(e => e.IdEmpleado == emp.IdEmpleado || e.NombreEmp.Equals(emp.NombreEmp));
        }

    }
}