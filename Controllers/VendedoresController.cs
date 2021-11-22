using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    public class VendedoresController : ControllerBase
    {
        private readonly fohaIniContext _context;
        private readonly IMapper _mapper;
        private readonly IDataRepository<Transformadores> _repo;
        private readonly IDataRepository<Etapa> _repoEtapa;

        public VendedoresController(fohaIniContext context, IMapper mapper, IDataRepository<Transformadores> repo)
        {
            _context = context;
            _mapper = mapper;
            _repo = repo;
        }

        // GET: api/Vendedores
        [HttpGet]
        public async Task<IActionResult> GetVendedores()
        {
            var res = new Response<Vendedores[]>();
            var vendedores =await _context.Vendedores.ToArrayAsync();
            
            res.Data=vendedores;
            res.Message="Ok";
            res.Status=200;
            return Ok(res);
        }
    }
}