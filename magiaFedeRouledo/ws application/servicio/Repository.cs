namespace ws_application.servicio
{
    public class Repository : IRepository
    {
        public async Task<DateTime> GetDate()
        {
            return new DateTime();
        }

        public async Task<bool> SaveDate()
        {
            throw new NotImplementedException();
        }
    }
}
