using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Foha.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Foha.Repositories;

// "SQLConnection": "Server=10.0.0.50;Database=foha;Trusted_Connection=True;User Id=sa;Password=102401;Integrated //////Security=false;MultipleActiveResultSets=true"

namespace Foha
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //CORS VIEJO
            // services.AddCors();
            
            //CORS NUEVO
            services.AddCors(o => o.AddPolicy("CORSPolicy", builder =>
            {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
            }));
            services.AddMvc().AddControllersAsServices();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddDbContext<fohaContext>(options => 
            options

            // .UseLazyLoadingProxies()
            // .ConfigureWarnings(x=>x.DetachedLazyLoadingWarning())
            
            .UseSqlServer(Configuration.GetConnectionString("SQLConnection")));
            services.AddAutoMapper();

            services.AddMvc().AddJsonOptions(
                options => options.SerializerSettings.ReferenceLoopHandling =            
                Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );
            
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                    .GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                ValidateIssuer = false,
                ValidateAudience = false,
                //nuevo
                ValidateLifetime=true
            };

            //nuevo
            // options.Events = new JwtBearerEvents
            // {
            //     OnAuthenticationFailed = context=>
            //     {
            //         if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            //         {   
            //             context.Response.Headers.Add("Token-Expired", "true");
            //         }
            //         return Task.CompletedTask;
            //     }
            // };
            
            });
            // services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped(typeof(IAuthRepository< >),typeof(AuthRepository< >));
            services.AddScoped(typeof(IDataRepository< >), typeof(DataRepository< >));
            services.AddScoped<ITokenRepository, TokenRepository>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }
            app.UseCors("CORSPolicy");
            //app.UseCors(x => x.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
            app.UseAuthentication();
            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
