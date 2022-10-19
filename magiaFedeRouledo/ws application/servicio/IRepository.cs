namespace ws_application.servicio
{
    interface IRepository
    {
        public Task<DateTime> GetDate();
        public Task<bool> SaveDate();
    }
}
