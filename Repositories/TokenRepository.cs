using System.Threading.Tasks;
using Foha.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;

namespace Foha.Repositories
{
    public class TokenRepository:ITokenRepository
    {
        private readonly fohaIniContext _context;
        private readonly IConfiguration _config;
        public TokenRepository(fohaIniContext context,IConfiguration config)
         {
             _context = context;
             _config = config;
         }

        public async Task<string> GenerateAccessToken(IEnumerable<Claim> claims)
        {
            // Console.WriteLine(claims);
            // Console.WriteLine(_config);
            // Console.WriteLine(_config.GetSection("AppSettings:Token").Value);
            var key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            
            // var tokenDescriptor = new SecurityTokenDescriptor
            // {
            //     Subject = new ClaimsIdentity(claims),
            //     // Expires = DateTime.Now.AddDays(1),
            //     Expires = DateTime.UtcNow.AddMinutes(5),
            //     SigningCredentials=creds
            // };

            //codigo de la pagina 
             var jwtToken = new JwtSecurityToken(
                // issuer: "Blinkingcaret",
                // audience: "Anyone",
                claims: claims,
                notBefore: DateTime.Now,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );
            var tokenHandler = new JwtSecurityTokenHandler();
            // var token = tokenHandler.CreateToken(tokenDescriptor);
            

            return tokenHandler.WriteToken(jwtToken);
        }

         public async Task<string> GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        public async Task<ClaimsPrincipal> GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false, //you might want to validate the audience and issuer depending on your use case
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(_config.GetSection("AppSettings:Token").Value)),
                ValidateLifetime = true //here we are saying that we care about the token's expiration date
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }
    }
}