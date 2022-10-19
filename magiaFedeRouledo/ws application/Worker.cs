using Microsoft.Extensions.Options;
using ws_application.servicio;

namespace ws_application
{
    internal class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IService _service;
        IHostApplicationLifetime _hostApplicationLifetime;


        public Worker(IHostApplicationLifetime hostApplicationLifetime, IService service)
        {
            _hostApplicationLifetime = hostApplicationLifetime;
            _service = service;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                if (stoppingToken.IsCancellationRequested)
                    return;
                InitOnlineProcess(stoppingToken);
            }
            catch (Exception ex)
            {
             
            }
        }

        private void InitOnlineProcess(CancellationToken stoppingToken)
        {
            System.Threading.Tasks.Task.Factory.StartNew(async () =>
            {
                int _wait = 1;
                while (!stoppingToken.IsCancellationRequested)
                {
                    Console.WriteLine(_wait);
                    //await InitProcess();

                    Thread.Sleep(new TimeSpan(0, 0, _wait));
                    _wait += 1;
                }
            });

        }
        private async Task InitProcess()
        {
            try
            {
                await _service.UpdateDB();

            }
            catch (Exception ex) {
                _logger.LogError(ex.Message, ex);
            }

        }
    }
}