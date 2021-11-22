using System.Data;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Foha.Dtos;
using Foha.Models;
using Foha.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Linq;
using Foha.DTOs;

namespace Foha.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController: ControllerBase
    {
        private readonly IAuthRepository<Usuario> _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        private readonly ITokenRepository _token;
        private readonly fohaIniContext _context;
        

        public AuthController(IAuthRepository<Usuario> repo, IConfiguration config, IMapper mapper, ITokenRepository token, fohaIniContext context)
        {
            _mapper = mapper;
            _config = config;
            _repo = repo;
            _token=token;
            _context=context;

        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            registerDto.nombreUs = registerDto.nombreUs.ToLower();
            
            Response<RegisterResponseDto> res = new Response<RegisterResponseDto>();

            if(!ModelState.IsValid)
            {
                res.Data = null;
                res.Message = "El usuario debe tener un sector y/o un tipo de usuario";
                res.Status = 400;
                return BadRequest(res);
            }

            if (await _repo.UserExists(registerDto.nombreUs))
            {
                res.Data = null;
                res.Message = "El usuario ya existe";
                res.Status = 400;
                return BadRequest(res);
            }
                
            var userToCreate = _mapper.Map<Usuario>(registerDto);
            try{
                var createdUser = await _repo.Register(userToCreate, registerDto.pass,registerDto.idTipoUs,registerDto.idSector);
                var userToResponse = _mapper.Map<RegisterResponseDto>(createdUser);
                res.Data = userToResponse;
                res.Message = "Ok";
                res.Status = 200;
                return Ok(res);
            }
            catch(DBConcurrencyException ex){
                throw ex;
            }
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {

            
            var userFromRepo = await _repo.Login(loginDto.NombreUs.ToLower(), loginDto.Pass,loginDto.RefreshToken);
            Response<LoggedDto> res =new Response<LoggedDto>();
            if (userFromRepo == null)
            {
                return Unauthorized();
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.IdUser.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.NombreUs)
            };

            

            var jwtToken = _token.GenerateAccessToken(claims);
            var refreshToken = await _token.GenerateRefreshToken();

            userFromRepo.RefreshToken = refreshToken;
            await PutUser(userFromRepo);
            
            
            
            // var key = new SymmetricSecurityKey(Encoding.UTF8
            //     .GetBytes(_config.GetSection("AppSettings:Token").Value));
            // var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            
            // var tokenDescriptor = new SecurityTokenDescriptor
            // {
            //     Subject = new ClaimsIdentity(claims),
            //     Expires = DateTime.Now.AddDays(1),
            //     SigningCredentials = creds
            // };

            // var tokenHandler = new JwtSecurityTokenHandler();

            // var token = tokenHandler.CreateToken(tokenDescriptor);
            
            LoggedDto userToRes = new LoggedDto();
            userToRes.IdTipoUs = userFromRepo.IdTipoUs;
            userToRes.Sector = userFromRepo.IdSector;
            userToRes.token = jwtToken.Result;
            res.Data = userToRes;
            res.Message = "Ok";
            res.Status = 200;
            return Ok(res);


            // return Ok(new {
            //     idTipoUs=userFromRepo.IdTipoUs,
            //     sector=userFromRepo.IdSector,
            //     token = jwtToken.Result,
            //     //refreshToken = refreshToken
            // }); 

            // return Ok(new {token = tokenHandler.WriteToken(token), user = userFromRepo.NombreUs});
        }

        [HttpPut]
        public async Task<IActionResult> PutUser(Usuario usuario)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // if (id != editUsuarioDto.IdCliente)
            // {
            //     return BadRequest();
            // }

            var preUsuario = _mapper.Map<Usuario>(usuario);
            _repo.Update(preUsuario);
            await _repo.SaveAsync(preUsuario);

            return NoContent();
        }

        [HttpPost("changePass")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePassDto us)
        {
            var user = await _repo.UserExists(us.NombreUs);
            if(user == false)
            { 
                return BadRequest("No existe un usuario con ese nombre");
            }

            var userToChange = _context.Usuario.Where(x=> x.NombreUs ==us.NombreUs).FirstOrDefault();
            
            
            var usuario= _repo.ChangePass(userToChange,us.Pass);
            return Ok(usuario);
            
            

            

            // var newPassword = _userManager.PasswordHasher.HashPassword(user,newpass);
            // user.PasswordHash = newPassword;
            // var res = await _userManager.UpdateAsync(user);

            // if (res.Succeeded) {/**/}
            // else { /**/}

            //     return Ok();
            // }
            
        }
    }
}