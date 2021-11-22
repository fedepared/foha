using System.Data;
using System.Threading.Tasks;
using Foha.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Foha.Repositories
{
    public class AuthRepository<T> : IAuthRepository<T> where T : class  

    {
        private readonly fohaIniContext _context;
        
        public AuthRepository(fohaIniContext context)
        {
            _context = context;
        }

        public async Task<Usuario> Login(string nombreUs, string pass,string refreshToken)
        {
            var user = await _context.Usuario.FirstOrDefaultAsync(x => x.NombreUs == nombreUs);
            if (user == null)
                return null;

            if (!VerifyPasswordHash(pass, user.Pass, user.Salt))
                return null;

            return user; // auth successful
        }

        
        public async Task<Usuario> Register(Usuario user, string pass, int idTipoUs, int? idSector)
        {
            byte[] passwordHash, salt;
            CreatePasswordHash(pass, out passwordHash, out salt);
            user.Pass = passwordHash;
            user.Salt = salt;
            
            await _context.Usuario.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private bool VerifyPasswordHash(string pass, byte[] passwordHash, byte[] salt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(salt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(pass));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i]) return false;
                }
            }
            return true;
        }

        private void CreatePasswordHash(string pass, out byte[] passwordHash, out byte[] salt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                salt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(pass));
            }
        }

        public async Task<Usuario> ChangePass(Usuario user, string pass){
            byte[] passwordHash, salt;
            CreatePasswordHash(pass, out passwordHash, out salt);
            user.Pass = passwordHash;
            user.Salt = salt;
            
            _context.Usuario.Update(user);
            
            try{
                await _context.SaveChangesAsync();
                return user;
            }catch(DBConcurrencyException err){
                throw err;
            }

        }

        public async Task<bool> UserExists(string Username)
        {
            if (await _context.Usuario.AnyAsync(x => x.NombreUs == Username))
                return true;
            return false;
        }

        public void Update(T entity)
        {
            _context.Set<T>().Update(entity);
        }


        public async Task<T> SaveAsync(T entity)
        {
            await _context.SaveChangesAsync();
            return entity;
        }

    }
}