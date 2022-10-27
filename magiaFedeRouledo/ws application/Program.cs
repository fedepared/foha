using ws_application.servicio;

namespace ws_application
{
    class Program
    {
        static void Main(string[] args)
        {
            var appBuilder = CreateHostBuilder(args).Build();
            appBuilder.Run();

        }
        public static IHostBuilder CreateHostBuilder(string[] args) =>
        
            Host.CreateDefaultBuilder(args)
             .ConfigureAppConfiguration(
                (hostContext, configApp) =>
                {
                    var env = hostContext.HostingEnvironment;
                    configApp.SetBasePath(Directory.GetCurrentDirectory());
                    configApp.AddJsonFile("appsettings.json");
                    configApp.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true);

                })
              .ConfigureServices((hostContext, services) =>
              {
                  services.AddSingleton<IService, Service>();

                  services.AddHostedService<Worker>();
              })
              .UseConsoleLifetime();
               //.UseWindowsService();
        
    }
}
