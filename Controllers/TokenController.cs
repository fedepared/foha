using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Foha.Models;
using Foha.Dtos;
using Foha.Repositories;
using AutoMapper;

namespace Foha.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly fohaContext _context;
        private readonly IMapper _mapper;
        private readonly ITokenRepository _token;
        private readonly IDataRepository<Usuario> _repo;
        public TokenController(fohaContext context, IMapper mapper, ITokenRepository token)
        {
            _context = context;
            _mapper = mapper;
            _token = token;
        }

        [HttpGet]
        public void Token()
        {
            Console.WriteLine("TOKEN WORKS");
        }

        [HttpPost]
        public async Task<IActionResult> Refresh(string token, string refreshToken)
        {
            var principal =await _token.GetPrincipalFromExpiredToken(token);
            var username = principal.Identity.Name; //this is mapped to the Name claim by default

            var user = _context.Usuario.SingleOrDefault(u => u.NombreUs == username);
            if (user == null || user.RefreshToken != refreshToken) return BadRequest();

            var newJwtToken = _token.GenerateAccessToken(principal.Claims);
            var newRefreshToken = await _token.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;

            var preUser = _mapper.Map<Usuario>(user);
            _repo.Update(preUser);
            await _repo.SaveAsync(preUser);
            

            return new ObjectResult(new
            {
                token = newJwtToken,
                refreshToken = newRefreshToken
            });
        }

        //[HttpPost, Authorize]
        [HttpPost]
        public async Task<IActionResult> Revoke()
        {
            var username = User.Identity.Name;

            var user = _context.Usuario.SingleOrDefault(u => u.NombreUs == username);
            if (user == null) return BadRequest();

            user.RefreshToken = null;

            var preUser = _mapper.Map<Usuario>(user);
            _repo.Update(preUser);
            await _repo.SaveAsync(preUser);

            return NoContent();
        }


    }
}