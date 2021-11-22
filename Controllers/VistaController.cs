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
using System.Collections;

namespace Foha.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VistaController : ControllerBase
    {
        private readonly fohaIniContext _context;
        private readonly IMapper _mapper;
        private readonly IDataRepository<MegaUltraArchiVista> _repo;

        public VistaController(fohaIniContext context, IMapper mapper, IDataRepository<MegaUltraArchiVista> repo)
        {
            _context = context;
            _mapper = mapper;
            _repo = repo;
        }


        // [HttpGet]
        // public IEnumerable<MegaUltraArchiVista> GetVista()
        // {
        //     return _context.MegaUltraArchiVista;
            
        // }

    }
}