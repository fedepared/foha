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
using Foha.DTOs;

namespace Foha.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SectoresController: ControllerBase 
    {
        private readonly fohaIniContext _context;
        private readonly IMapper _mapper;
        private readonly IDataRepository<TipoEtapa> _repo;

        public SectoresController(fohaIniContext context, IMapper mapper, IDataRepository<TipoEtapa> repo)
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

        [HttpGet("getSectoresReport")]
        public async Task<IActionResult> GetSectoresReport()
        {
            Response<Sectores[]> res= new Response<Sectores[]>();
            try
            {
                res.Data=await _context.Sectores.Where(x=>x.IdSector!=10 && x.IdSector!=11).ToArrayAsync();
                res.Status = 200;
                res.Message = "Ok";
                return Ok(res);
            }
            catch(Exception ex)
            {
                res.Status=400;
                res.Message= ex.Message;
                return BadRequest(res);
            }
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