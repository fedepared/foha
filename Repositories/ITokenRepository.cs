using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Foha.Models;

namespace Foha.Repositories
{
    public interface ITokenRepository
    {

    
    Task<string> GenerateAccessToken(IEnumerable<Claim> claims);
    Task<string> GenerateRefreshToken();
    Task<ClaimsPrincipal> GetPrincipalFromExpiredToken(string token);

    }
}
