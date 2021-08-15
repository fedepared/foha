using System.Threading.Tasks;
using Foha.Models;

namespace Foha.Repositories
{
    public interface IAuthRepository<T> where T : class
     {
        Task<Usuario> Register(Usuario user, string pass, int idTipoUs, int? idSector);
        
        Task<Usuario> Login(string user, string pass,string refreshToken);
        Task<Usuario> ChangePass(Usuario user, string pass);
        Task<bool> UserExists(string username);
        void Update(T entity);
        Task<T> SaveAsync(T entity);
        
    }
}