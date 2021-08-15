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
    

         public class TipoTransfoController : ControllerBase
        {
        private readonly fohaContext _context;
        private readonly IMapper _mapper;
        private readonly IDataRepository<TipoTransfo> _repo;

        public TipoTransfoController(fohaContext context, IMapper mapper, IDataRepository<TipoTransfo> repo)
        {
            _context = context;
            _mapper = mapper;
            _repo = repo;

        }

        [HttpGet]
        public IEnumerable<TipoTransfo> GetTipoTransfos()
        {
            return _context.TipoTransfo;
        }


        

        
    }
}