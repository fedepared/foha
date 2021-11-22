using System.Collections.Generic;
using System.Threading.Tasks;
using Foha.Models;

namespace Foha.Repositories
{
    public class DataRepository<T> : IDataRepository<T> where T : class
    {
        private readonly fohaIniContext _context;

        public DataRepository(fohaIniContext context)
        {
            _context = context;
        }

        public void Add(T entity)
        {
            _context.Set<T>().Add(entity);
        }

        public void Update(T entity)
        {
            _context.Set<T>().Update(entity);
        }

        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
        }

        public void UpdateAll(List<T> entity)
        {
            foreach(var a in entity)
            {
                _context.Set<T>().Update(a);
            }
        }

        public async Task<T> SaveAsync(T entity)
        {
            await _context.SaveChangesAsync();
            return entity;
        }
    }
}