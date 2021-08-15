using System.Collections.Generic;
using System.Threading.Tasks;

namespace Foha.Repositories
{
    public interface IDataRepository<T> where T : class
    {
        void Add(T entity);
        void Update(T entity);

        void UpdateAll(List<T> entity);
        void Delete(T entity);
        Task<T> SaveAsync(T entity);
    }
}