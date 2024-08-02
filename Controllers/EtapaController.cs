using System.IO.Compression;
using System.Collections;
using System.Globalization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Foha.Models;
using AutoMapper;
using Foha.Repositories;
using Foha.Dtos;
using System.Text;
using Foha.DTOs;
using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;

namespace Foha.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EtapaController : ControllerBase
    {
        private readonly fohaIniContext _context;
        private readonly IMapper _mapper;
        private readonly IDataRepository<Etapa> _repo;
        private readonly IDataRepository<EtapaEmpleado> _repo2;

        public EtapaController(fohaIniContext context, IMapper mapper, IDataRepository<Etapa> repo,IDataRepository<EtapaEmpleado> repo2)
        {

            _context = context;
            _mapper = mapper;
            _repo = repo;
            _repo2 = repo2;
        }

        // GET: api/Etapa
        [HttpGet]
        public IEnumerable<Etapa> GetEtapa()
        {
            return _context.Etapa.OrderBy(x=>x.IdEtapa).ThenBy(x=>x.IdTipoEtapa).Include(x=>x.EtapaEmpleado);
        }

        // GET: api/Etapa/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEtapa([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var etapa = await _context.Etapa.FindAsync(id);

            if (etapa == null)
            {
                return NotFound();
            }

            return Ok(etapa);
        }


        [HttpGet("{id}/resultadoTransfo")]
        public async Task<IActionResult> getEtapasPorIdTransfo([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var etapa = await _context.Etapa.Where(x=> x.IdTransfo == id).ToListAsync();

            if (etapa == null)
            {
                return NotFound();
            }

            return Ok(etapa);
        }

        [HttpGet("{idTransfo}/{sector}/byIdTransfo")]
        public async Task<IActionResult> getEtapaByIdTransfo([FromRoute] int idTransfo,[FromRoute] int sector)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var etapa=new List<Etapa>();

            switch (sector){
              case 2:
                    etapa = await _context.Etapa
                    .Where(x=>x.IdTransfo==idTransfo && ((x.IdTipoEtapa>=2 && x.IdTipoEtapa<=14)) )
                    .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation)
                    .Include(x=>x.IdColorNavigation)
                    .ToListAsync();
                    // etapasPorSector.Add("BT1",2);
                    // etapasPorSector.Add("BT2",3);
                    // etapasPorSector.Add("BT3",4);
                    // etapasPorSector.Add("AT1",5);
                    // etapasPorSector.Add("AT2",6);
                    // etapasPorSector.Add("AT3",7);
                    // etapasPorSector.Add("RG1",8);
                    // etapasPorSector.Add("RG2",9);
                    // etapasPorSector.Add("RG3",10);
                    // etapasPorSector.Add("RF1",11);
                    // etapasPorSector.Add("RF2",12);
                    // etapasPorSector.Add("RF3",13);
                    // etapasPorSector.Add("ENS",14);    
                    break;
              case 3:
                    etapa = await _context.Etapa
                    .Where(x=>x.IdTransfo==idTransfo && ((x.IdTipoEtapa>=15 && x.IdTipoEtapa<=17) || x.IdTipoEtapa>=21 && x.IdTipoEtapa<=27 || x.IdTipoEtapa == 33 || x.IdTipoEtapa == 34 || x.IdTipoEtapa == 33 || x.IdTipoEtapa == 38 || x.IdTipoEtapa == 39 || x.IdTipoEtapa == 40 || x.IdTipoEtapa == 41 || x.IdTipoEtapa == 42 || x.IdTipoEtapa == 43))
                    .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation)
                    .Include(x=>x.IdColorNavigation)
                    .ToListAsync();
                    // etapasPorSector.Add("PY CYP",15);
                    // etapasPorSector.Add("PY SOL",16);
                    // etapasPorSector.Add("PY ENV",17);
                    // etapasPorSector.Add("CUBA CYP",21);
                    // etapasPorSector.Add("TAPA",22);
                    // etapasPorSector.Add("RAD/PAN",23);
                    // etapasPorSector.Add("CUBA",24);
                    // etapasPorSector.Add("TINT",25);
                    // etapasPorSector.Add("GRAN",26);
                    // etapasPorSector.Add("PINT",27);
                    break;
              
              case 5:
                    etapa = await _context.Etapa
                    .Where(x=>x.IdTransfo==idTransfo && (x.IdTipoEtapa>=19 && x.IdTipoEtapa<=20) || x.IdTipoEtapa == 35 || x.IdTipoEtapa == 36 )
                    .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation)
                    .Include(x=>x.IdColorNavigation)
                    .ToListAsync();
                    // etapasPorSector.Add("MON",19);
                    // etapasPorSector.Add("HOR",20);
                    break;
              case 7:
                    etapa = await _context.Etapa
                    .Where(x=>x.IdTransfo==idTransfo && (x.IdTipoEtapa==20 || x.IdTipoEtapa==28))
                    .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation)
                    .Include(x=>x.IdColorNavigation)
                    .ToListAsync();
                    // etapasPorSector.Add("HOR",20);
                    // etapasPorSector.Add("ENC",28);
                break;
              case 9:
                    etapa = await _context.Etapa
                    .Where(x=>x.IdTransfo==idTransfo && (x.IdTipoEtapa==30 || x.IdTipoEtapa==31 || x.IdTipoEtapa==32 ))
                    .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation)
                    .Include(x=>x.IdColorNavigation)
                    .ToListAsync(); 
                    // etapasPorSector.Add("TERM",30);
                    // etapasPorSector.Add("APR",31);
                    // etapasPorSector.Add("ENV",32);
                    break;
              case 10:
                    etapa = await _context.Etapa
                    .Where(x=>x.IdTransfo==idTransfo && x.IdTipoEtapa != 14)
                    .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation)
                    .Include(x=>x.IdColorNavigation)
                    .ToListAsync(); 
                    break;
                //encubado Enc
                case 12:
                    etapa = await _context.Etapa
                    .Where(x=>x.IdTransfo==idTransfo && (x.IdTipoEtapa==20 || x.IdTipoEtapa==28 || x.IdTipoEtapa==32 ))
                    .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation)
                    .Include(x=>x.IdColorNavigation)
                    .ToListAsync(); 
                    // etapasPorSector.Add("HOR",20);
                    // etapasPorSector.Add("ENC",28);
                    // etapasPorSector.Add("ENV",32);
                    break;

                //caldereria enc 
                // case 21:
                //     break;
                //cyp
                case 22:
                    etapa = await _context.Etapa
                    .Where(x=>x.IdTransfo==idTransfo && (x.IdTipoEtapa==15 || x.IdTipoEtapa==21 ))
                    .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation)
                    .Include(x=>x.IdColorNavigation)
                    .ToListAsync(); 
                    // etapasPorSector.Add("PY CYP",15);
                    // etapasPorSector.Add("CUBA CYP",21);
                    break;
                //soldadura
                case 23:
                    etapa = await _context.Etapa
                    .Where(x=>x.IdTransfo==idTransfo && (x.IdTipoEtapa==16 || x.IdTipoEtapa==22 || x.IdTipoEtapa==24 ))
                    .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation)
                    .Include(x=>x.IdColorNavigation)
                    .ToListAsync(); 
                    // etapasPorSector.Add("PY SOL",16);
                    // etapasPorSector.Add("TAPA",22);
                    // etapasPorSector.Add("CUBA",24);
                    break;
                //granallado
                case 24:
                    etapa = await _context.Etapa
                    .Where(x=>x.IdTransfo==idTransfo && (x.IdTipoEtapa==22 || x.IdTipoEtapa==24 || x.IdTipoEtapa==25 || x.IdTipoEtapa==26 || x.IdTipoEtapa==40))
                    .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation)
                    .Include(x=>x.IdColorNavigation)
                    .ToListAsync(); 
                    // etapasPorSector.Add("TINT",25);
                    // etapasPorSector.Add("GRAN",26);
                    break;
                //pintura
                case 25:
                    etapa = await _context.Etapa
                    .Where(x=>x.IdTransfo==idTransfo && (x.IdTipoEtapa==31 || x.IdTipoEtapa==40 || x.IdTipoEtapa==22 || x.IdTipoEtapa==27 || x.IdTipoEtapa==25))
                    .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation)
                    .Include(x=>x.IdColorNavigation)
                    .ToListAsync(); 
                    // etapasPorSector.Add("TAPA",22);
                    // etapasPorSector.Add("PINT",27);
                    break;
                //SuperAdmin
                case 26:
                    etapa = await _context.Etapa
                    .Where(x=>x.IdTransfo==idTransfo && x.IdTipoEtapa != 14)
                    .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation)
                    .Include(x=>x.IdColorNavigation)
                    .ToListAsync(); 
                    break;
            }


            // var etapa = await _context.Etapa
            // .Where(x=>x.IdTransfo==idTransfo)
            // .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation)
            // .Include(x=>x.IdColorNavigation)
            // .ToListAsync();
            if(etapa == null)
            {
                return NotFound();
            }
            return Ok(etapa);
        }

        [HttpGet("getByIdTrafoIdTipoEtapa/{idTrafo}/{idTipoEtapa}")]
        public async Task<IActionResult>GetEtapaByIdTrafoIdTipoEtapa([FromRoute] int idTrafo,[FromRoute] int idTipoEtapa)
        {
            var trafo =await _context.Transformadores.Where(x=>x.IdTransfo==idTrafo).FirstOrDefaultAsync();
            var etapa = await _context.Etapa.Where(x=>x.IdTransfo==idTrafo && x.IdTipoEtapa==idTipoEtapa)
            .Include(x=>x.IdColorNavigation)
            .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation).FirstOrDefaultAsync();
            // .Where(x=>x.IdTransfo==idTrafo && x.Etapa.Any(f=>f.IdTipoEtapa==idTipoEtapa)).FirstOrDefaultAsync();

            Transformadores trafoToSend = new Transformadores();
            trafoToSend=trafo;
            trafoToSend.Etapa.Add(etapa);

        
            if(trafoToSend!=null)
            {
                return Ok(trafoToSend);
            }
            else{
                return BadRequest("No existe registro");
            }
        }

        [HttpPut("{id}/etapaSola")]
         public async Task<IActionResult> PutEtapaSola([FromRoute] int id, [FromBody] int idTransfo)
         {
             if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var etapa = await _context.Etapa.FindAsync(id);
            
            if (etapa == null)
            {
                return NotFound();
            }
             
            string cadena="UPDATE Etapa SET idTransfo = ";
            string cadena2=$"{cadena}{idTransfo}";
            string cadena3=" WHERE idEtapa = ";
            string cadena4=$"{cadena2}{cadena3}{etapa.IdEtapa}"; 

            var resultado = _context.Etapa.FromSql(cadena4);        
            // _context.Database.ExecuteSqlCommand("UPDATE [foha].[dbo].[Etapa] SET IdTransfo = @idTransfo WHERE IdEtapa = @idEtapa)",
            // new SqlParameter("@idEtapa", etapa.IdEtapa));
            // new SqlParameter("@idTransfo",idTransformador);

            return Ok(resultado);

         }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEtapa([FromRoute] int id, [FromBody] EditEtapaDto editEtapaDto)
        {
             if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);
            editEtapaDto.UltimoUsuario = jwtSecurityToken.Claims.ElementAt(1).Value;
            editEtapaDto.FechaUltimaModificacion = DateTime.Now;

            // if (id != editEtapaDto.IdEtapa)
            // {
            //     return BadRequest();
            // }
            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);
            if(preEtapa.IdColor == null){
                preEtapa.IdColor = 1069;
            }
            else if(preEtapa.IdColor != null && preEtapa.IdColor == 10){
                preEtapa.DateFin = DateTime.Now;
                preEtapa.DateIni = DateTime.Now;
                preEtapa.IsEnded = true;
            }
            else if(preEtapa.IdColor != null && preEtapa.IdColor == 1034){
                preEtapa.IsEnded = true;
            }
            _repo.Update(preEtapa);
            try{
                await _repo.SaveAsync(preEtapa);
                return StatusCode(201,preEtapa);
            }catch(Exception e){
                return Conflict(e.Message);
            }
            
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> Patch(int id, [FromBody] EditEtapaDto editEtapaDto)
        {
            var etapa = await _context.Etapa.FirstAsync(x => x.IdEtapa == editEtapaDto.IdEtapa);
            etapa.IdTransfo=editEtapaDto.IdTransfo;
            await _context.SaveChangesAsync();
            
            return StatusCode(200,etapa);
        }

        [HttpPut("switchEtapas")]
        public async Task<ActionResult> PutSwitchEtapas([FromBody] IEnumerable<EditEtapaDto> editEtapaDto)
        {
        
            foreach (var item in editEtapaDto)
            {

                //PROCESOS=ETAPAS
                var etapaDelTrafoNuevo=_context.Etapa.First(x=>x.IdTransfo==Convert.ToInt16(item.Hora) && x.IdTipoEtapa==item.IdTipoEtapa);
                etapaDelTrafoNuevo.IdTransfo=item.IdTransfo;
                //Ultimo usuario y fecha de ultima modificacion
                var accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(accessToken);
                etapaDelTrafoNuevo.UltimoUsuario = jwtSecurityToken.Claims.ElementAt(1).Value;
                etapaDelTrafoNuevo.FechaUltimaModificacion = DateTime.Now;
                //Termina Ultimo usuario y fecha de ultima modificacion
                var preEtapa = _mapper.Map<Etapa>(etapaDelTrafoNuevo);
                _repo.Update(preEtapa);
                await _repo.SaveAsync(preEtapa);
                item.IdTransfo=Convert.ToInt16(item.Hora);
                item.Hora=null;
                var preEtapa2 = _mapper.Map<Etapa>(item);
                _repo.Update(preEtapa2);
                await _repo.SaveAsync(preEtapa2);
            }
            return StatusCode(200);
        
        }

        [HttpPut("switchArrTrafos")]
        public async Task<ActionResult> switchArrTrafos([FromBody] ObjectModel objectArr)
        {
            var prueba=objectArr;

            int counter=0;
            foreach(var viejo in prueba.TrafoViejoArr)
            {
                var nuevo=prueba.TrafoNuevoArr[counter];
                foreach(var idProceso in prueba.EtapasArr)
                {
                    var etapaDelNuevo=_context.Etapa.First(x=>x.IdTransfo==nuevo && x.IdTipoEtapa==idProceso);
                    var etapaDelViejo=_context.Etapa.First(x=>x.IdTransfo==viejo && x.IdTipoEtapa==idProceso);
                    etapaDelNuevo.IdTransfo=viejo;
                    etapaDelViejo.IdTransfo=nuevo;
                    List<Etapa> etapas = new List<Etapa>();
                    etapas.Add(etapaDelViejo);
                    etapas.Add(etapaDelNuevo);
                    var preEtapaDelViejo = _mapper.Map<Etapa>(etapaDelViejo);
                    var preEtapaDelNuevo = _mapper.Map<Etapa>(etapaDelNuevo);
                    try{

                        _repo.UpdateAll(etapas);
                    }
                    catch(DbUpdateConcurrencyException){
                        throw;
                    }
                    await _repo.SaveAsync(preEtapaDelViejo);
                }
                counter++;  
            }
            
            return StatusCode(200,"Procesos modificados correctamente");
        
        }

        [HttpPut("modifyProcesses")]
        public async Task<IActionResult> ModifyProcesses([FromBody] EditAllTrafoEtapaDto edit)
        {
            Response<string> r = new Response<string>();
            foreach (var trafo in edit.ArrayTrafo)
            {
                foreach (var tipoEtapa in edit.IdTipoEtapa)
                {    
                    var referencia = _context.Colores.Find(edit.IdRef);
                    var etapa=_context.Etapa.Where(x=>x.IdTransfo == trafo).FirstOrDefault(z=>z.IdTipoEtapa==tipoEtapa);
                    //Ultimo usuario y fecha de ultima modificacion
                    var accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                    var handler = new JwtSecurityTokenHandler();
                    var jwtSecurityToken = handler.ReadJwtToken(accessToken);
                    etapa.UltimoUsuario = jwtSecurityToken.Claims.ElementAt(1).Value;
                    etapa.FechaUltimaModificacion = DateTime.Now;
                    etapa.Observacion = edit.Observacion;
                    //Termina Ultimo usuario y fecha de ultima modificacion
                    if(referencia != null)
                    {
                        if(referencia.Leyenda == "finalizado")
                        {
                            etapa.DateIni = DateTime.Now;
                            etapa.DateFin = DateTime.Now;
                            etapa.IsEnded = true;
                            etapa.IdColor = referencia.IdColor;
                            etapa.TiempoParc = "Finalizada";
                        }
                        else {
                            etapa.IdColor = referencia.IdColor;
                        }
                    }
                    else{
                        List<EtapaEmpleado> EtapasEmp = await _context.EtapaEmpleado.Where(x => x.IdEtapa == etapa.IdEtapa).ToListAsync();
                        _context.RemoveRange(EtapasEmp);
                        etapa.DateFin=null;
                        etapa.DateIni=null;
                        etapa.EtapaEmpleado=null;
                        etapa.IdColor=null;
                        etapa.IsEnded=null;
                        etapa.TiempoParc=null;
                        etapa.TiempoFin=null;
                        etapa.NumEtapa=null;
                        etapa.IsEnded=null;
                        etapa.InicioProceso=null;
                        
                    }
                    _repo.Update(etapa);
                }
            }
            try{
                await _context.SaveChangesAsync();
                r.Status = 200;
                r.Message = "El pedido se realizo correctamente";
                r.Data = null;
                return Ok(r);
            }
            catch(Exception e){
                r.Message = e.Message;
                r.Status = 409;
                return Conflict(r);
            }
        }

        // PUT: api/Etapa/5
        [HttpPut("{id}/timer")]
        public async Task<IActionResult> PutEtapaTimer([FromRoute] int id, [FromBody] EditEtapaDto editEtapaDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //Ultimo usuario y fecha de ultima modificacion
            var accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);
            editEtapaDto.UltimoUsuario = jwtSecurityToken.Claims.ElementAt(1).Value;
            editEtapaDto.FechaUltimaModificacion = DateTime.Now;
            //Termina Ultimo usuario y fecha de ultima modificacion
            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);
            var etapaDatosAnteriores=_context.Etapa.AsNoTracking().First(z=>z.IdEtapa==preEtapa.IdEtapa);
            
            foreach(var a in editEtapaDto.EtapaEmpleado)
            {
                var preEtapaEmpleado=_mapper.Map<EtapaEmpleado>(a);
                
                //Busco si el empleado ya había trabajado en el proceso (entra también cuando se pausa)
                if(_context.EtapaEmpleado.AsNoTracking().Where(z=>z.IdEmpleado==preEtapaEmpleado.IdEmpleado && z.IdEtapa==preEtapaEmpleado.IdEtapa).Count()>0)
                {
                    var tiempoAntes=_context.EtapaEmpleado.AsNoTracking().FirstOrDefault(z=>z.IdEmpleado==preEtapaEmpleado.IdEmpleado && z.IdEtapa==preEtapaEmpleado.IdEtapa);
                    
                    
                    if(tiempoAntes.TiempoParc=="00:00:00:00" && tiempoAntes.IsEnded==null)
                    {
                        int[] etapaDatosAnterioresTiempoAntes = Array.ConvertAll(etapaDatosAnteriores.TiempoParc.Split(':'),Int32.Parse);
                        int[] etapaDatosActualesTiempoAntes = Array.ConvertAll(preEtapa.TiempoParc.Split(':'),Int32.Parse);
                        a.TiempoParc=preEtapa.TiempoParc;
                        a.IsEnded=false;
                    }
                    //si se pausa o finaliza
                    else
                    {
                        //si se finaliza
                        if(preEtapa.DateFin.HasValue)
                        {
                            a.TiempoFin=preEtapa.TiempoFin;
                            a.IsEnded=true;
                        }
                        //si se pausa
                        else
                        {
                            string[] arrTAntesStr=tiempoAntes.TiempoParc.Split(':');
                            string[] arrTDespuesStr=preEtapaEmpleado.TiempoParc.Split(':');
                            int[] tiempoAntesArrInt= Array.ConvertAll(arrTAntesStr,Int32.Parse);
                            int[] tiempoDespuesArrInt=Array.ConvertAll(arrTDespuesStr,Int32.Parse);
                            int[] tiempoIntFinal={0,0,0,0};
                            int meLlevoUno=0;
                            string tiempoStringFinal=null;
                        
                            for(int i=3;i>-1;i--)
                            {
                                switch(i){
                                    default:
                                        tiempoIntFinal[i]=tiempoAntesArrInt[i]+tiempoDespuesArrInt[i]+meLlevoUno;
                                        meLlevoUno=tiempoIntFinal[i]/60;
                                        tiempoIntFinal[i]=tiempoIntFinal[i]%60;
                                        break;
                                    case 0:
                                            tiempoIntFinal[i]=tiempoAntesArrInt[i]+tiempoDespuesArrInt[i]+meLlevoUno;
                                            break;
                                    case 1:
                                        tiempoIntFinal[i]=tiempoAntesArrInt[i]+tiempoDespuesArrInt[i]+meLlevoUno;
                                        meLlevoUno=tiempoIntFinal[i]/24;
                                        tiempoIntFinal[i]=tiempoIntFinal[i]%24;
                                        break;
                                }
                            }

                            
                            var builder = new StringBuilder();
                            for(int j=0;j<tiempoIntFinal.Length;j++)
                            {
                                if(tiempoIntFinal[j]<10)
                                {
                                    builder.Append("0");
                                }
                                builder.Append(tiempoIntFinal[j]);
                                if(j!=3)
                                {
                                    builder.Append(":");	
                                }
                                
                                tiempoStringFinal=builder.ToString();
                            }   
                            
                            preEtapaEmpleado.TiempoParc=tiempoStringFinal;  
                        }

                    }
                    try{
                        _repo2.Update(preEtapaEmpleado);
                    }
                    catch(DbUpdateConcurrencyException){
                        throw;
                    }
                }
                else{
                    try{

                        _repo2.Add(preEtapaEmpleado);
                    }
                    catch(DbUpdateConcurrencyException)
                    {
                        throw;
                    }
                }

                await _repo2.SaveAsync(preEtapaEmpleado);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EtapaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            _repo.Update(preEtapa);

            return StatusCode(201,await _repo.SaveAsync(preEtapa));
           // return StatusCode(201,preEtapa);
        }

        
        //Inicio
        [HttpPut("{id}/start")]
        public async Task<IActionResult> PutEtapaInicio([FromRoute] int id, [FromBody] EditEtapaDto editEtapaDto)
        {
            string mensaje = "Se inicio el proceso con exito.";
            string mensajeEtapasIniciadas="";
            var etapaAnterior=_context.Etapa.AsNoTracking().First(x=>x.IdEtapa==id);
            if(etapaAnterior.IdColor==editEtapaDto.IdColor)
            {
                return Conflict("La etapa ya había sido iniciada, por favor actualice la vista");
            }

            if(editEtapaDto.IdTipoEtapa == 28)
            {
                await ChequearHorno();
                Etapa etapaHorno = _context.Etapa.AsNoTracking().Where(x => x.IdTransfo == editEtapaDto.IdTransfo && x.IdTipoEtapa == 20).First();
                if(etapaHorno.IsEnded == false || etapaHorno.IsEnded == null){
                    etapaHorno.IdColor = 9;
                    etapaHorno.FechaPausa = DateTime.Now;
                    var editDTO = _mapper.Map<EditEtapaDto>(etapaHorno); 
                    if(editDTO.TiempoParc == null && editDTO.DateIni == null){
                        editDTO.TiempoParc = DateTime.Now.ToString(@"M/d/yyyy h:mm:ss tt",CultureInfo.InvariantCulture);
                    }     
                    else if( editDTO.TiempoParc == null && editDTO.DateIni != null){
                        editDTO.TiempoParc = editDTO.DateIni.Value.ToString(@"M/d/yyyy h:mm:ss tt",CultureInfo.InvariantCulture);
                    }
                    await PutEtapaPausa(etapaHorno.IdEtapa, editDTO);                
                }
            }

            //Si el proceso se inicia por primera vez
            if(etapaAnterior.DateIni==null)
            {
                editEtapaDto.DateIni=DateTime.Now;
                editEtapaDto.TiempoParc=DateTime.Now.ToString();
            }
            else
            {
                editEtapaDto.DateIni=etapaAnterior.DateIni;
                editEtapaDto.TiempoParc=etapaAnterior.TiempoParc;
                editEtapaDto.InicioProceso=DateTime.Now;
                editEtapaDto.FechaPausa=etapaAnterior.FechaPausa;
            }

            
            foreach(var a in editEtapaDto.EtapaEmpleado)
            {
                int?[] TipoEtapaFitrada = new int?[] {2,3,4,5,6,7,8,9,10,11,12,13,22,24,43};
                if(TipoEtapaFitrada.Contains(editEtapaDto.IdTipoEtapa))
                {
                    List<EtapaEmpleado> EtapasIniciadas = _context.EtapaEmpleado
                                                        .Where(x => x.IdEmpleado == a.IdEmpleado && x.IdEtapaNavigation.IdColor == 1030)
                                                        .Include(x => x.IdEtapaNavigation)
                                                        .Include(x => x.IdEtapaNavigation.IdTransfoNavigation)
                                                        .Include(x => x.IdEtapaNavigation.IdTipoEtapaNavigation)
                                                        .Include(x => x.IdEmpleadoNavigation)
                                                        .ToList();
                    if( EtapasIniciadas.Count() > 0)
                    {
                        string nombreEmp = _context.Empleado.Where(x => x.IdEmpleado == a.IdEmpleado).First().NombreEmp;
                        mensajeEtapasIniciadas += "El empleado " + nombreEmp + " tiene los siguientes procesos iniciados: \n ";
                        foreach(EtapaEmpleado e in EtapasIniciadas)
                        {
                            mensajeEtapasIniciadas = mensajeEtapasIniciadas + "Proceso: " + e.IdEtapaNavigation.IdTipoEtapaNavigation.Abrev
                                            + " - OT: " + e.IdEtapaNavigation.IdTransfoNavigation.OTe
                                            + " - OP: " + e.IdEtapaNavigation.IdTransfoNavigation.OPe
                                            + " - Rango: " + e.IdEtapaNavigation.IdTransfoNavigation.RangoInicio
                                            + " - Fecha de Inicio: " + e.DateIni.ToString() + "\n";
                        }
                        //return StatusCode(500, mensaje);
                    }
                }
                //Busco si el empleado ya había trabajado en el proceso
                var findEtapaEmpleado=_context.EtapaEmpleado.AsNoTracking().Any(z=>z.IdEmpleado==a.IdEmpleado && z.IdEtapa==a.IdEtapa);
                a.DateIni=editEtapaDto.DateIni;
                var preEtapaEmpleado=_mapper.Map<EtapaEmpleado>(a);
                //no lo encuentra
                if(findEtapaEmpleado==false)
                {

                    a.TiempoParc="00:00:00:00";
                    try{
                        _repo2.Add(preEtapaEmpleado);
                    }
                    catch(DbUpdateConcurrencyException){
                        throw;
                    }
                    
                }
                else{
                    var foundEtapaEmpleado=_context.EtapaEmpleado.AsNoTracking().First(z=>z.IdEmpleado==a.IdEmpleado && z.IdEtapa==a.IdEtapa);
                    a.TiempoParc=foundEtapaEmpleado.TiempoParc;
                    a.DateIni=foundEtapaEmpleado.DateIni;
                    try{
                        _repo2.Update(preEtapaEmpleado);
                    }
                    catch(DbUpdateConcurrencyException){
                        throw;
                    }
                }
                
                await _repo2.SaveAsync(preEtapaEmpleado);
            
            }
            //Ultimo usuario y fecha de ultima modificacion
            var accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);
            editEtapaDto.UltimoUsuario = jwtSecurityToken.Claims.ElementAt(1).Value;
            editEtapaDto.FechaUltimaModificacion = DateTime.Now;
            //Termina Ultimo usuario y fecha de ultima modificacion
            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);
            
            _repo.Update(preEtapa);

            await _repo.SaveAsync(preEtapa);

            return mensajeEtapasIniciadas.Equals("") ? StatusCode(201, mensaje) : StatusCode(201,mensajeEtapasIniciadas);
        }

        //Pausa
        [HttpPut("{id}/pause")]
        public async Task<IActionResult> PutEtapaPausa([FromRoute] int id, [FromBody] EditEtapaDto editEtapaDto)
        {
            var etapaAntes=_context.Etapa.AsNoTracking().First(x=>x.IdEtapa==id);
            if(etapaAntes.IdColor==editEtapaDto.IdColor)
            {
                return Conflict("La etapa ya había sido pausada, por favor actualice la vista");
            }           
            editEtapaDto.DateIni=etapaAntes.DateIni;
            editEtapaDto.FechaPausa=DateTime.Now;
            if(etapaAntes.TiempoParc == null && etapaAntes.DateFin != null){
                etapaAntes.TiempoParc = etapaAntes.DateFin.Value.ToString(@"M/d/yyyy h:mm:ss tt",CultureInfo.InvariantCulture);
            }
            else if(etapaAntes.TiempoParc == null && etapaAntes.DateFin == null){
                if(etapaAntes.DateIni != null){
                    etapaAntes.TiempoParc = etapaAntes.DateIni.Value.ToString(@"M/d/yyyy h:mm:ss tt",CultureInfo.InvariantCulture);
                }
                else{
                    etapaAntes.TiempoParc = DateTime.Now.ToString(@"M/d/yyyy h:mm:ss tt",CultureInfo.InvariantCulture);
                }
            }
            //chequeo si es el primer comienzo
            if(etapaAntes.InicioProceso==null)
            {
                //Tiempo parcial 
                TimeSpan preEtapaTiempoParc = (DateTime.Now - DateTime.ParseExact(etapaAntes.TiempoParc, "M/d/yyyy h:mm:ss tt", CultureInfo.InvariantCulture));
                //SOLO PARA ETAPA HORNO
                if(editEtapaDto.IdTipoEtapa == 20)
                {
                    List<EtapaEmpleado> etapaEmp = _context.EtapaEmpleado.Where(x => x.IdEtapa == id).ToList();
                    foreach(var a in etapaEmp)
                    {
                        //Calculo el nuevo tiempo para el empleado encontrado
                        a.DateIni=etapaAntes.DateIni;
                        a.TiempoParc=preEtapaTiempoParc.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                        var preEtapaEmpleado=_mapper.Map<EtapaEmpleado>(a);
                        try{
                            _repo2.Update(preEtapaEmpleado);
                            await _repo2.SaveAsync(preEtapaEmpleado);
                        }
                        catch(DbUpdateConcurrencyException){
                            throw;
                        }

                    }
                }
                
                foreach(var a in editEtapaDto.EtapaEmpleado)
                {
                    
                    //Calculo el nuevo tiempo para el empleado encontrado
                    a.DateIni=etapaAntes.DateIni;
                    a.TiempoParc=preEtapaTiempoParc.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                    var preEtapaEmpleado=_mapper.Map<EtapaEmpleado>(a);
                    try{
                        _repo2.Update(preEtapaEmpleado);
                        await _repo2.SaveAsync(preEtapaEmpleado);
                    }
                    catch(DbUpdateConcurrencyException){
                        throw;
                    }

                }

                editEtapaDto.TiempoParc = preEtapaTiempoParc.Multiply(editEtapaDto.EtapaEmpleado.Count()).ToString(@"dd\:hh\:mm\:ss");

            }
            else{
                //calculo el nuevo intervalo 
                TimeSpan preEtapaTiempoParc = (TimeSpan)(DateTime.Now - etapaAntes.InicioProceso);
                //SOLO PARA ETAPA HORNO
                if(editEtapaDto.IdTipoEtapa == 20)
                {
                    List<EtapaEmpleado> etapaEmp = _context.EtapaEmpleado.Where(x => x.IdEtapa == id).ToList();
                    foreach(var a in etapaEmp)
                    {
                        
                        //Calculo el nuevo tiempo para el empleado encontrado
                        a.DateIni=etapaAntes.DateIni;
                        a.TiempoParc=preEtapaTiempoParc.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                        var preEtapaEmpleado=_mapper.Map<EtapaEmpleado>(a);
                        try{
                            _repo2.Update(preEtapaEmpleado);
                            await _repo2.SaveAsync(preEtapaEmpleado);
                        }
                        catch(DbUpdateConcurrencyException){
                            throw;
                        }

                    }
                }
                else
                {
                    foreach(var a in editEtapaDto.EtapaEmpleado)
                    {
                        var isEtapaEmpleadoAntes=_context.EtapaEmpleado.AsNoTracking().First(x=>x.IdEmpleado==a.IdEmpleado && x.IdEtapa==a.IdEtapa);
                        TimeSpan tiempoParcial=(TimeSpan.ParseExact(isEtapaEmpleadoAntes.TiempoParc,"dd\\:hh\\:mm\\:ss",CultureInfo.InvariantCulture)).Add(preEtapaTiempoParc);
                        a.TiempoParc=tiempoParcial.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                        a.DateIni=editEtapaDto.DateIni;
                        var preEtapaEmpleado=_mapper.Map<EtapaEmpleado>(a);
                        try{
                            _repo2.Update(preEtapaEmpleado);
                            await _repo2.SaveAsync(preEtapaEmpleado);
                        }
                        catch(DbUpdateConcurrencyException){
                            throw;
                        }
                    }
                }
                
                var horasHombre=preEtapaTiempoParc.Multiply(editEtapaDto.EtapaEmpleado.Count());
                TimeSpan suma = new TimeSpan();
                var prueba=etapaAntes.TiempoParc;
                var prueba2=horasHombre;
                if(etapaAntes.DateIni.Value.Year == 2021){
                        etapaAntes.TiempoParc = editEtapaDto.TiempoParc;
                }
                suma=TimeSpan.ParseExact(etapaAntes.TiempoParc,"dd\\:hh\\:mm\\:ss",CultureInfo.InvariantCulture).Add(horasHombre);
                editEtapaDto.TiempoParc=suma.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
            }
            // //Ultimo usuario y fecha de ultima modificacion
            var accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);
            editEtapaDto.UltimoUsuario = jwtSecurityToken.Claims.ElementAt(1).Value;
            editEtapaDto.FechaUltimaModificacion = DateTime.Now;
            editEtapaDto.UltimoUsuario = "Christian";
            editEtapaDto.FechaUltimaModificacion = DateTime.Now;
            // //Termina Ultimo usuario y fecha de ultima modificacion
            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);
            _repo.Update(preEtapa);
            try{
                await _repo.SaveAsync(preEtapa);
                return StatusCode(201,preEtapa);
               }
            catch(DbUpdateConcurrencyException){
                throw;
            }
        }

        //Fin
        [HttpPut("{id}/stop")]
        public async Task<IActionResult> PutEtapaStop([FromRoute] int id, [FromBody] EditEtapaDto editEtapaDto)
        {
            Response<String> r = new Response<string>();
            var etapaAntes=_context.Etapa.AsNoTracking().First(x=>x.IdEtapa==id);
            if(etapaAntes.IdColor==10)
            {
                r.Status = 500;
                r.Data = "La etapa ya había sido finalizada, por favor actualice la vista";
                r.Message = "La etapa ya había sido finalizada, por favor actualice la vista";
                return Conflict(r);
            }
            
            editEtapaDto.DateIni=etapaAntes.DateIni;
            editEtapaDto.DateFin=DateTime.Now;
            if(etapaAntes.TiempoParc == null && etapaAntes.DateFin != null){
                etapaAntes.TiempoParc = etapaAntes.DateFin.Value.ToString(@"M/d/yyyy h:mm:ss tt",CultureInfo.InvariantCulture);
            }
            else if(etapaAntes.TiempoParc == null && etapaAntes.DateFin == null){
                etapaAntes.TiempoParc = etapaAntes.DateIni.Value.ToString(@"M/d/yyyy h:mm:ss tt",CultureInfo.InvariantCulture);
            }

            //chequeo si es el primer comienzo
            if(etapaAntes.InicioProceso==null)
            {
                //Tiempo parcial 
                TimeSpan preEtapaTiempoParc = (DateTime.Now - DateTime.ParseExact(etapaAntes.TiempoParc, "M/d/yyyy h:mm:ss tt", CultureInfo.InvariantCulture));
                //Para develop
                // TimeSpan preEtapaTiempoParc = (DateTime.Now - DateTime.ParseExact(etapaAntes.TiempoParc, "dd/M/yyyy H:mm:ss", CultureInfo.InvariantCulture));
                editEtapaDto.TiempoFin = preEtapaTiempoParc.Multiply(editEtapaDto.EtapaEmpleado.Count()).ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                var listaCheck = new [] {2,3,4,5,6,7,8,9,10,11,12,13,24};
                if (listaCheck.Contains(editEtapaDto.IdTipoEtapa.Value))
                {
                     TimeSpan tiempoEtapa = TimeSpan.Parse(editEtapaDto.TiempoFin);
                     TimeSpan kb = new TimeSpan(0,30,0);
                     if(TimeSpan.Compare(tiempoEtapa,kb) == -1){
                        r.Status = 409;
                        r.Data = "El tiempo de finalizacion de la etapa es muy bajo";
                        r.Message = "El tiempo de finalizacion de la etapa es muy bajo";
                        return Conflict(r);
                     }
                }
                foreach(var a in editEtapaDto.EtapaEmpleado)
                {
                    
                    //Calculo el nuevo tiempo para el empleado encontrado
                    a.DateIni=etapaAntes.DateIni;
                    a.TiempoParc=preEtapaTiempoParc.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                    a.DateFin=editEtapaDto.DateFin;
                    a.TiempoFin=editEtapaDto.TiempoFin;
                    a.IsEnded=true;
                    var preEtapaEmpleado=_mapper.Map<EtapaEmpleado>(a);
                    try{
                        _repo2.Update(preEtapaEmpleado);
                    }
                    catch(DbUpdateConcurrencyException){
                        throw;
                    }

                }
            }
            else{
                //calculo el nuevo intervalo 
                TimeSpan preEtapaTiempoParc = (TimeSpan)(DateTime.Now - etapaAntes.InicioProceso);
                var horasHombre=preEtapaTiempoParc.Multiply(editEtapaDto.EtapaEmpleado.Count());
                TimeSpan suma = new TimeSpan();
                suma =(TimeSpan.ParseExact(etapaAntes.TiempoParc != "Finalizada" ? etapaAntes.TiempoParc : "00:00:00:00","dd\\:hh\\:mm\\:ss",CultureInfo.InvariantCulture)).Add(horasHombre);
                editEtapaDto.TiempoFin=suma.ToString(@"dd\:hh\:mm\:ss");
                var listaCheck = new [] {2,3,4,5,6,7,8,9,10,11,12,13,24};
                if (listaCheck.Contains(editEtapaDto.IdTipoEtapa.Value) && editEtapaDto.TiempoParc != "Finalizada")
                {
                     TimeSpan tiempoEtapa = TimeSpan.Parse(editEtapaDto.TiempoFin);
                     TimeSpan kb = new TimeSpan(0,30,0);
                     if(TimeSpan.Compare(tiempoEtapa,kb) == -1){
                        r.Status = 500;
                        r.Data = "El tiempo de finalizacion de la etapa es muy bajo";
                        r.Message = "El tiempo de finalizacion de la etapa es muy bajo";
                        return Conflict(r);
                     }
                }
                foreach(var a in editEtapaDto.EtapaEmpleado)
                {
                    var isEtapaEmpleadoAntes=_context.EtapaEmpleado.AsNoTracking().First(x=>x.IdEmpleado==a.IdEmpleado && x.IdEtapa==a.IdEtapa);
                    TimeSpan tiempoParcial=(TimeSpan.ParseExact(isEtapaEmpleadoAntes.TiempoParc,"dd\\:hh\\:mm\\:ss",CultureInfo.InvariantCulture)).Add(preEtapaTiempoParc);
                    a.TiempoParc=tiempoParcial.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                    a.DateIni=editEtapaDto.DateIni;
                    a.TiempoFin=editEtapaDto.TiempoFin;
                    a.DateFin=editEtapaDto.DateFin;
                    a.IsEnded=true;
                    var preEtapaEmpleado=_mapper.Map<EtapaEmpleado>(a);
                    try{
                        _repo2.Update(preEtapaEmpleado);
                    }
                    catch(DbUpdateConcurrencyException){
                        throw;
                    }
                }
              
            }

            editEtapaDto.TiempoParc="Finalizada";
            editEtapaDto.IsEnded=true;

            // //Ultimo usuario y fecha de ultima modificacion
            var accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);
            editEtapaDto.UltimoUsuario = jwtSecurityToken.Claims.ElementAt(1).Value;
            editEtapaDto.FechaUltimaModificacion = DateTime.Now;
            //Termina Ultimo usuario y fecha de ultima modificacion
            
            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);

            _repo.Update(preEtapa);

            // if(editEtapaDto.IdTipoEtapa == 29){
            //     Transformadores trafo = _context.Etapa.Where(x => x.IdEtapa == editEtapaDto.IdEtapa).Include(x => x.IdTransfoNavigation).First().IdTransfoNavigation;
            //     trafo.Serie = editEtapaDto.NumEtapa;
            //     await _context.SaveChangesAsync();
            // }

            foreach (var a in _context.EtapaEmpleado.Where(x=>x.IdEtapa==editEtapaDto.IdEtapa))
            {
                a.DateFin=editEtapaDto.DateFin;
                a.IsEnded=true;
                a.TiempoFin=editEtapaDto.TiempoFin;
            }
            try{
                await _repo.SaveAsync(preEtapa);
                r.Data = "Se finalizo el proceso con exito";
                r.Message = "Se finalizo el proceso con exito";
                r.Status = 200;
                return Ok(r);
            }
            catch(Exception e){
                r.Data = e.Message;
                r.Message = e.Message;
                r.Status = 500;
                return Conflict(r);
            }
        }

        [HttpPut("{id}/stopEtapaEspecial")]
        public async Task<IActionResult> stopEtapaEspecial([FromRoute] int id, [FromBody] EditEtapaDto editEtapaDto)
        {
            var etapaAntes=_context.Etapa.AsNoTracking().First(x=>x.IdEtapa==id);
            if(etapaAntes.IdColor==editEtapaDto.IdColor)
            {
                return Conflict("La etapa ya había sido finalizada, por favor actualice la vista");
            }
            //Ultimo usuario y fecha de ultima modificacion
            var accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);
            editEtapaDto.UltimoUsuario = jwtSecurityToken.Claims.ElementAt(1).Value;
            editEtapaDto.FechaUltimaModificacion = DateTime.Now;
            //Termina Ultimo usuario y fecha de ultima modificacion

            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);
            preEtapa.TiempoParc="Finalizada";
            
            foreach(var a in editEtapaDto.EtapaEmpleado)
            {
                var preEtapaEmpleado=_mapper.Map<EtapaEmpleado>(a);
                try{
                    _repo2.Add(preEtapaEmpleado);
                    }
                catch(DbUpdateConcurrencyException){
                    throw;
                }
                await _repo2.SaveAsync(preEtapaEmpleado);
            }

            
            _repo.Update(preEtapa);

            return StatusCode(201,await _repo.SaveAsync(preEtapa));
        }


        //MultiProcesos
        [HttpPut("pause/{id}/{length}")]
        public async Task<IActionResult> PutEtapaPauseMulti([FromRoute] int id, [FromBody] EditEtapaDto editEtapaDto,[FromRoute] int length)
        {
            var etapaAntes=_context.Etapa.AsNoTracking().First(x=>x.IdEtapa==id);
            if(etapaAntes.IdColor==editEtapaDto.IdColor)
            {
                return Conflict("La etapa ya había sido pausada, por favor actualice la vista");
            }

            editEtapaDto.DateIni=etapaAntes.DateIni;
            editEtapaDto.FechaPausa=DateTime.Now;
            //chequeo si es el primer comienzo
            if(etapaAntes.InicioProceso==null)
            {
                //Tiempo parcial 
                TimeSpan preEtapaTiempoParc = ((DateTime.Now - DateTime.Parse(etapaAntes.TiempoParc))/length);
                
                foreach(var a in editEtapaDto.EtapaEmpleado)
                {
                    
                    //Calculo el nuevo tiempo para el empleado encontrado
                    a.DateIni=etapaAntes.DateIni;
                    a.TiempoParc=preEtapaTiempoParc.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                    var preEtapaEmpleado=_mapper.Map<EtapaEmpleado>(a);
                    try{
                        _repo2.Update(preEtapaEmpleado);
                    }
                    catch(DbUpdateConcurrencyException){
                        throw;
                    }

                }

                editEtapaDto.TiempoParc = preEtapaTiempoParc.Multiply(editEtapaDto.EtapaEmpleado.Count()).ToString(@"dd\:hh\:mm\:ss");

            }
            else{
                //calculo el nuevo intervalo 
                TimeSpan preEtapaTiempoParc = (TimeSpan)((DateTime.Now - etapaAntes.InicioProceso)/length);
                foreach(var a in editEtapaDto.EtapaEmpleado)
                {
                    var isEtapaEmpleadoAntes=_context.EtapaEmpleado.AsNoTracking().First(x=>x.IdEmpleado==a.IdEmpleado && x.IdEtapa==a.IdEtapa);
                    TimeSpan tiempoParcial=(TimeSpan.ParseExact(isEtapaEmpleadoAntes.TiempoParc,"dd\\:hh\\:mm\\:ss",CultureInfo.InvariantCulture)).Add(preEtapaTiempoParc);
                    a.TiempoParc=tiempoParcial.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                    a.DateIni=editEtapaDto.DateIni;
                    var preEtapaEmpleado=_mapper.Map<EtapaEmpleado>(a);
                    try{
                        _repo2.Update(preEtapaEmpleado);
                    }
                    catch(DbUpdateConcurrencyException){
                        throw;
                    }
                }
                var horasHombre=preEtapaTiempoParc.Multiply(editEtapaDto.EtapaEmpleado.Count());
                TimeSpan suma = new TimeSpan();
                var prueba=etapaAntes.TiempoParc;
                var prueba2=horasHombre;
                suma=TimeSpan.ParseExact(etapaAntes.TiempoParc,"dd\\:hh\\:mm\\:ss",CultureInfo.InvariantCulture).Add(horasHombre);
                editEtapaDto.TiempoParc=suma.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
            }

            //Ultimo usuario y fecha de ultima modificacion
            var accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);
            editEtapaDto.UltimoUsuario = jwtSecurityToken.Claims.ElementAt(1).Value;
            editEtapaDto.FechaUltimaModificacion = DateTime.Now;
            //Termina Ultimo usuario y fecha de ultima modificacion

            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);
            _repo.Update(preEtapa);
            await _repo.SaveAsync(preEtapa);
            return StatusCode(201,preEtapa);
        }

        [HttpGet("actualizarEtapas")]
        public void ActualizarEtapas(){
            var trafos=_context.Transformadores.ToArray();
            var tipoEtapas = _context.TipoEtapa.Where(x=>x.IdTipoEtapa>33).ToList();
            for (var i = 0; i < trafos.Count(); i++)
            {
                List<Etapa> listaEtapa = new List<Etapa>();
                foreach (var tipoEtapa in tipoEtapas)
                {
                    Etapa etapa = new Etapa();
                    etapa.IdTransfo=trafos[i].IdTransfo;
                    etapa.IdTipoEtapa=tipoEtapa.IdTipoEtapa;
                    listaEtapa.Add(etapa);
                }
                _context.Etapa.AddRange(listaEtapa);
            }

            // _repo.UpdateAll(etapas);
            var res= _context.SaveChanges();

        }

        [HttpPut("stop/{id}/{length}")]
        public async Task<IActionResult> PutEtapaStopMulti([FromRoute] int id, [FromBody] EditEtapaDto editEtapaDto,[FromRoute] int length)        
        {
            var etapaAntes=_context.Etapa.AsNoTracking().First(x=>x.IdEtapa==id);
            if(etapaAntes.IdColor==editEtapaDto.IdColor)
            {
                return Conflict("La etapa ya había sido finalizada, por favor actualice la vista");
            }
            
            editEtapaDto.DateIni=etapaAntes.DateIni;
            editEtapaDto.DateFin=DateTime.Now;

            //chequeo si es el primer comienzo
            if(etapaAntes.InicioProceso==null)
            {
                //Tiempo parcial 
                TimeSpan preEtapaTiempoParc = ((DateTime.Now - DateTime.Parse(etapaAntes.TiempoParc))/length);
                editEtapaDto.TiempoFin = preEtapaTiempoParc.Multiply(editEtapaDto.EtapaEmpleado.Count()).ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                
                foreach(var a in editEtapaDto.EtapaEmpleado)
                {
                    
                    //Calculo el nuevo tiempo para el empleado encontrado
                    a.DateIni=etapaAntes.DateIni;
                    a.TiempoParc=preEtapaTiempoParc.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                    a.DateFin=editEtapaDto.DateFin;
                    a.TiempoFin=editEtapaDto.TiempoFin;
                    a.IsEnded=true;
                    var preEtapaEmpleado=_mapper.Map<EtapaEmpleado>(a);
                    try{
                        _repo2.Update(preEtapaEmpleado);
                    }
                    catch(DbUpdateConcurrencyException){
                        throw;
                    }

                }


            }
            else{
                //calculo el nuevo intervalo 
                TimeSpan preEtapaTiempoParc = (TimeSpan)((DateTime.Now - etapaAntes.InicioProceso)/length);
                var horasHombre=preEtapaTiempoParc.Multiply(editEtapaDto.EtapaEmpleado.Count());
                TimeSpan suma = new TimeSpan();
                suma =(TimeSpan.ParseExact(etapaAntes.TiempoParc,"dd\\:hh\\:mm\\:ss",CultureInfo.InvariantCulture)).Add(horasHombre);
                editEtapaDto.TiempoFin=suma.ToString(@"dd\:hh\:mm\:ss");
                foreach(var a in editEtapaDto.EtapaEmpleado)
                {
                    var isEtapaEmpleadoAntes=_context.EtapaEmpleado.AsNoTracking().First(x=>x.IdEmpleado==a.IdEmpleado && x.IdEtapa==a.IdEtapa);
                    TimeSpan tiempoParcial=(TimeSpan.ParseExact(isEtapaEmpleadoAntes.TiempoParc,"dd\\:hh\\:mm\\:ss",CultureInfo.InvariantCulture)).Add(preEtapaTiempoParc);
                    a.TiempoParc=tiempoParcial.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                    a.DateIni=editEtapaDto.DateIni;
                    a.TiempoFin=editEtapaDto.TiempoFin;
                    a.DateFin=editEtapaDto.DateFin;
                    a.IsEnded=true;
                    var preEtapaEmpleado=_mapper.Map<EtapaEmpleado>(a);
                    try{
                        _repo2.Update(preEtapaEmpleado);
                    }
                    catch(DbUpdateConcurrencyException){
                        throw;
                    }
                }
              
            }

            editEtapaDto.TiempoParc="Finalizada";
            editEtapaDto.IsEnded=true;

            //Ultimo usuario y fecha de ultima modificacion
            var accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);
            editEtapaDto.UltimoUsuario = jwtSecurityToken.Claims.ElementAt(1).Value;
            editEtapaDto.FechaUltimaModificacion = DateTime.Now;
            //Termina Ultimo usuario y fecha de ultima modificacion
            
            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);

            _repo.Update(preEtapa);

            if(editEtapaDto.IdTipoEtapa == 29){
                Transformadores trafo = _context.Etapa.Where(x => x.IdEtapa == editEtapaDto.IdEtapa).Include(x => x.IdTransfoNavigation).First().IdTransfoNavigation;
                trafo.Serie = editEtapaDto.NumEtapa;
                await _context.SaveChangesAsync();
            }
            
            foreach (var a in _context.EtapaEmpleado.Where(x=>x.IdEtapa==editEtapaDto.IdEtapa))
            {
                a.DateFin=editEtapaDto.DateFin;
                a.IsEnded=true;
                a.TiempoFin=editEtapaDto.TiempoFin;
            }
            return StatusCode(201,await _repo.SaveAsync(preEtapa));
        }

        

        [HttpPut("{id}/reanudarFinalizado")]
        public async Task<IActionResult> reanudarFinalizado([FromRoute] int id, [FromBody] EditEtapaDto editEtapaDto)
        {
            foreach(var a in editEtapaDto.EtapaEmpleado)
            {
                a.IsEnded=null;
                a.TiempoFin=null;
                a.DateFin=null;
            }
            editEtapaDto.IsEnded=false;
            editEtapaDto.DateFin=null;
            editEtapaDto.TiempoParc=editEtapaDto.TiempoFin;
            editEtapaDto.TiempoFin=null;
            editEtapaDto.IdColor=9;

            //Ultimo usuario y fecha de ultima modificacion
            var accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);
            editEtapaDto.UltimoUsuario = jwtSecurityToken.Claims.ElementAt(1).Value;
            editEtapaDto.FechaUltimaModificacion = DateTime.Now;
            //Termina Ultimo usuario y fecha de ultima modificacion

            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);
            _repo.Update(preEtapa);
            await _repo.SaveAsync(preEtapa);
            return StatusCode(201,preEtapa);
        }
        // POST: api/Etapa
        [HttpPost]
        public async Task<IActionResult> PostEtapa([FromBody] AddEtapaDto addEtapaDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //Ultimo usuario y fecha de ultima modificacion
            var accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);
            addEtapaDto.UltimoUsuario = jwtSecurityToken.Claims.ElementAt(1).Value;
            addEtapaDto.FechaUltimaModificacion = DateTime.Now;
            //Termina Ultimo usuario y fecha de ultima modificacion

            var preEtapa = _mapper.Map<Etapa>(addEtapaDto);
            _repo.Add(preEtapa);
            var saveEtapa = await _repo.SaveAsync(preEtapa);
            var etapaResponse = _mapper.Map<EtapaResponseDto>(saveEtapa);

            return Ok(etapaResponse);

        }

        // DELETE: api/Etapa/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEtapa([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var etapa = await _context.Etapa.FindAsync(id);

            if (etapa == null)
            {
                return NotFound();
            }

            _context.Database.ExecuteSqlCommand("UPDATE [test2].[dbo].[transformadores] SET etapa = NULL WHERE etapa IN (SELECT idEtapa FROM [test2].[dbo].etapa WHERE  IdEtapa = @idEtapa)",
            new SqlParameter("@idEtapa", etapa.IdEtapa));

             _context.Database.ExecuteSqlCommand("DELETE FROM  [test2].[dbo].etapa WHERE IdEtapa = @idEtapa",
            new SqlParameter("@idEtapa", etapa.IdEtapa));

            _context.Etapa.Remove(etapa);
            await _context.SaveChangesAsync();

            return Ok(etapa);
        }


        [HttpGet("etapasFinalizadas")]

        public IEnumerable<Etapa> GetEtapasFinalizadas()
        {

            var etapas=_context.Etapa.Where(x=>x.IsEnded==true).OrderBy(z=>z.DateFin).Include(x=>x.IdTipoEtapaNavigation).Include(z=>z.IdTransfoNavigation).ToList();
            //var etapas=_context.Etapa.Where(x=>x.IsEnded==true);

            return etapas;
        }

        [HttpGet("etapaNumProc/{oldNumProc}")]
        public async Task<ActionResult> etapaNumProc([FromRoute] int oldNumProc)
        {
            var etapa= await _context.Etapa.Include(y=>y.IdTransfoNavigation).Where(x=>x.NumEtapa==oldNumProc).ToArrayAsync();
            if(etapa.Length == 0)
            {
                return NotFound("No existe proceso con ese número");
            }
            else{
                return Ok(etapa);
            }
        }

        [HttpPatch("patchProcNum/{IdEtapa}")]
        public async Task<ActionResult> patchNum([FromRoute] int IdEtapa, [FromBody] int newNum )
        {
            var etapa = await _context.Etapa.FindAsync(IdEtapa);
            etapa.NumEtapa=newNum;
            await _context.SaveChangesAsync();
            return Ok("Actualización exitosa");
        }

        [HttpGet("getColumns/{id}")]

        public IDictionary<string,int> GetColumns([FromRoute] int id)
        {
            Dictionary<string, int> etapasPorSector = new Dictionary<string, int>();
            
            switch (id){
              case 1:
                    etapasPorSector.Add("DOC",1);
                    break;
              case 2:
                    etapasPorSector.Add("BT1",2);
                    etapasPorSector.Add("BT2",3);
                    etapasPorSector.Add("BT3",4);
                    etapasPorSector.Add("AT1",5);
                    etapasPorSector.Add("AT2",6);
                    etapasPorSector.Add("AT3",7);
                    etapasPorSector.Add("RG1",8);
                    etapasPorSector.Add("RG2",9);
                    etapasPorSector.Add("RG3",10);
                    etapasPorSector.Add("RF1",11);
                    etapasPorSector.Add("RF2",12);
                    etapasPorSector.Add("RF3",13);
                    //etapasPorSector.Add("ENS",14);  
                    break;
              case 3:
                    etapasPorSector.Add("CUBA CYP",21);
                    etapasPorSector.Add("RAD \n PAN",23);
                    etapasPorSector.Add("CUBI",43);
                    etapasPorSector.Add("SOL \n CUBA",24);
                    etapasPorSector.Add("HERM",25);
                    etapasPorSector.Add("GRAN \n CUBA",26);
                    etapasPorSector.Add("PINT \n CUBA",27);
                    etapasPorSector.Add("ENV \n CUBA",38);
                    etapasPorSector.Add("CYP \n TAPA",39);
                    etapasPorSector.Add("SOL \n TAPA",22);
                    etapasPorSector.Add("GRAN \n TAPA",40);
                    etapasPorSector.Add("PINT \n TAPA",41);
                    etapasPorSector.Add("ENV \n TAPA",42);
                    etapasPorSector.Add("PY CYP",15);
                    etapasPorSector.Add("PY SOL",16);
                    etapasPorSector.Add("PY ENV",17);
                    etapasPorSector.Add("CYP PAT",33);
                    etapasPorSector.Add("PAT ENV",34);
                    break;
              case 4:
                    etapasPorSector.Add("NUC",18);
                    break;
              case 5:
                    etapasPorSector.Add("MON",19);
                    etapasPorSector.Add("HOR",20);
                    etapasPorSector.Add("CON BT",35);
                    etapasPorSector.Add("CON AT",36);
                    break;
              case 6:
                    etapasPorSector.Add("HOR",20);
                    break;
              case 7:
                    etapasPorSector.Add("HOR",20);
                    etapasPorSector.Add("ENC",28);
                break;
              case 8:
                    etapasPorSector.Add("REL TRANSF",37);
                    etapasPorSector.Add("LAB",29);
                    etapasPorSector.Add("CH \n CAR",44);
                    etapasPorSector.Add("APR",31);
                    break;
              case 9:                
                    etapasPorSector.Add("CH \n CAR",44);
                    etapasPorSector.Add("TERM",30);
                    etapasPorSector.Add("APR",31);
                    etapasPorSector.Add("ENV",32);
                    break;
              case 10:
                    etapasPorSector.Add("DOC",1);
                    etapasPorSector.Add("BT1",2);
                    etapasPorSector.Add("BT2",3);
                    etapasPorSector.Add("BT3",4);
                    etapasPorSector.Add("AT1",5);
                    etapasPorSector.Add("AT2",6);
                    etapasPorSector.Add("AT3",7);
                    etapasPorSector.Add("RG1",8);
                    etapasPorSector.Add("RG2",9);
                    etapasPorSector.Add("RG3",10);
                    etapasPorSector.Add("RF1",11);
                    etapasPorSector.Add("RF2",12);
                    etapasPorSector.Add("RF3",13);
                    //etapasPorSector.Add("ENS",14);
                    etapasPorSector.Add("PY CYP",15);
                    etapasPorSector.Add("PY SOL",16);
                    etapasPorSector.Add("PY ENV",17);
                    etapasPorSector.Add("CYP PAT",33);
                    etapasPorSector.Add("PAT ENV",34);
                    etapasPorSector.Add("NUC",18);
                    etapasPorSector.Add("MON",19);
                    etapasPorSector.Add("CON BT",35);
                    etapasPorSector.Add("CON AT",36);
                    etapasPorSector.Add("REL \n TRA",37);
                    etapasPorSector.Add("HOR",20);
                    etapasPorSector.Add("CUBA \n CYP",21);
                    etapasPorSector.Add("RAD \n PAN",23);
                    etapasPorSector.Add("CUBI",43);
                    etapasPorSector.Add("SOL \n CUBA",24);
                    etapasPorSector.Add("HERM",25);
                    etapasPorSector.Add("GRAN \n CUBA",26);
                    etapasPorSector.Add("PINT \n CUBA",27);
                    etapasPorSector.Add("ENV \n CUBA",38);
                    etapasPorSector.Add("CYP \n TAPA",39);
                    etapasPorSector.Add("SOL \n TAPA",22);
                    etapasPorSector.Add("GRAN \n TAPA",40);
                    etapasPorSector.Add("PINT \n TAPA",41);
                    etapasPorSector.Add("ENV \n TAPA",42);
                    etapasPorSector.Add("ENC",28);
                    etapasPorSector.Add("LAB",29);
                    etapasPorSector.Add("CH. \n CAR",44);
                    etapasPorSector.Add("TERM",30);
                    etapasPorSector.Add("APR",31);
                    etapasPorSector.Add("ENV",32);
                    break;
                //encubado Enc
                case 12:
                    etapasPorSector.Add("HOR",20);
                    etapasPorSector.Add("ENC",28);
                    etapasPorSector.Add("ENV",32);
                    etapasPorSector.Add("LAB",29);
                    etapasPorSector.Add("TERM",30);
                    etapasPorSector.Add("APR",31);
                    break;

                //caldereria enc 
                case 21:
                    break;
                //cyp
                case 22:
                    etapasPorSector.Add("PY CYP",15);
                    etapasPorSector.Add("CYP PAT",33);
                    etapasPorSector.Add("CUBA CYP",21);
                    break;
                //soldadura
                case 23:
                    etapasPorSector.Add("CUBI",43);
                    etapasPorSector.Add("PY SOL",16);
                    etapasPorSector.Add("SOL \n TAPA",22);
                    etapasPorSector.Add("SOL \n CUBA",24);
                    break;
                //granallado
                case 24:
                    etapasPorSector.Add("SOL \n TAPA",22);//Pedido Lucas Solo Lectura
                    etapasPorSector.Add("SOL \n CUBA",24);//Pedido Lucas Solo Lectura
                    etapasPorSector.Add("HERM",25);
                    etapasPorSector.Add("GRAN \n CUBA",26);
                    etapasPorSector.Add("GRAN \n TAPA",40);
                    break;
                //pintura
                case 25:
                    // etapasPorSector.Add("SOL \n TAPA",22);
                    etapasPorSector.Add("GRAN \n CUBA",26);
                    etapasPorSector.Add("GRAN \n TAPA",40);
                    etapasPorSector.Add("PINT \n CUBA",27);
                    etapasPorSector.Add("PINT \n TAPA",41);
                    break;
                //SuperAdmin
                case 26:
                    etapasPorSector.Add("DOC",1);
                    etapasPorSector.Add("BT1",2);
                    etapasPorSector.Add("BT2",3);
                    etapasPorSector.Add("BT3",4);
                    etapasPorSector.Add("AT1",5);
                    etapasPorSector.Add("AT2",6);
                    etapasPorSector.Add("AT3",7);
                    etapasPorSector.Add("RG1",8);
                    etapasPorSector.Add("RG2",9);
                    etapasPorSector.Add("RG3",10);
                    etapasPorSector.Add("RF1",11);
                    etapasPorSector.Add("RF2",12);
                    etapasPorSector.Add("RF3",13);
                    //etapasPorSector.Add("ENS",14);
                    etapasPorSector.Add("PY CYP",15);
                    etapasPorSector.Add("PY SOL",16);
                    etapasPorSector.Add("PY ENV",17);
                    etapasPorSector.Add("CYP PAT",33);
                    etapasPorSector.Add("PAT ENV",34);
                    etapasPorSector.Add("NUC",18);
                    etapasPorSector.Add("MON",19);
                    etapasPorSector.Add("CON BT",35);
                    etapasPorSector.Add("CON AT",36);
                    etapasPorSector.Add("REL \n TRA",37);
                    etapasPorSector.Add("HOR",20);
                    etapasPorSector.Add("CUBA \n CYP",21);
                    etapasPorSector.Add("RAD \n PAN",23);
                    etapasPorSector.Add("CUBI",43);
                    etapasPorSector.Add("SOL \n CUBA",24);
                    etapasPorSector.Add("HERM",25);
                    etapasPorSector.Add("GRAN \n CUBA",26);
                    etapasPorSector.Add("PINT \n CUBA",27);
                    etapasPorSector.Add("ENV \n CUBA",38);
                    etapasPorSector.Add("CYP \n TAPA",39);
                    etapasPorSector.Add("SOL \n TAPA",22);
                    etapasPorSector.Add("GRAN \n TAPA",40);
                    etapasPorSector.Add("PINT \n TAPA",41);
                    etapasPorSector.Add("ENV \n TAPA",42);
                    etapasPorSector.Add("ENC",28);
                    etapasPorSector.Add("LAB",29);
                    etapasPorSector.Add("CH. \n CAR",44);
                    etapasPorSector.Add("TERM",30);
                    etapasPorSector.Add("APR",31);
                    etapasPorSector.Add("PAGO",45);
                    etapasPorSector.Add("ENV",32);
                    break;
            }
            return etapasPorSector;
        }

        private bool EtapaExists(int id)
        {
            return _context.Etapa.Any(e => e.IdEtapa == id);
        }


        private string Suma(EtapaEmpleado antes,EtapaEmpleado despues)
        {
            int[] tiempoEmpleadoAntes = Array.ConvertAll(antes.TiempoParc.Split(':'),Int32.Parse);
            int[] tiempoEmpleadoAhora = Array.ConvertAll(despues.TiempoParc.Split(':'),Int32.Parse);
            TimeSpan spanEmpleadoAntes = new TimeSpan(tiempoEmpleadoAntes[0],tiempoEmpleadoAntes[1],tiempoEmpleadoAntes[2],tiempoEmpleadoAntes[3]);
            TimeSpan spanEmpleadoAhora = new TimeSpan(tiempoEmpleadoAhora[0],tiempoEmpleadoAhora[1],tiempoEmpleadoAhora[2],tiempoEmpleadoAhora[3]);
            TimeSpan spanEmpleadoSuma = spanEmpleadoAhora.Add(spanEmpleadoAntes);
            return spanEmpleadoSuma.ToString(@"dd\:hh\:mm\:ss");
        }

        [HttpPost("EtapasPorSector")]
        public async Task<ActionResult> EtapasPorSector([FromBody] EtapaPorSectorDto etapaPorSectorDto)
        {
            Response<List<ReportesDTO>> r = new Response<List<ReportesDTO>>();
            List<ReportesDTO> EtapasResponse = new List<ReportesDTO>();
            List<Etapa> etapas = new List<Etapa>();
            DateTime desde = DateTimeOffset.FromUnixTimeMilliseconds(etapaPorSectorDto.DesdeMili).UtcDateTime;
            DateTime hasta = DateTimeOffset.FromUnixTimeMilliseconds(etapaPorSectorDto.HastaMili).UtcDateTime;
            int?[] Sector = new int?[] { 1 };
            List<int> newOrder = new List<int>() { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 33, 34, 18, 19, 35, 36, 37, 20, 21, 23, 43, 24, 25, 26, 27, 38, 39, 22, 40, 41, 42, 28, 29, 30, 31, 45, 32 };
            switch(etapaPorSectorDto.IdSect){
                case 1:
                    Sector = new int?[] { 1 };
                    break;
                case 2:
                    Sector = new int?[] { 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 };
                    break;
                case 3:
                    Sector = new int?[] { 15, 16, 17, 21, 22, 23, 24, 25, 26, 27, 33, 34, 38, 39, 40, 41, 42, 43 };
                    break;
                case 4:
                    Sector = new int?[] { 18 };
                    break;
                case 5:
                    Sector = new int?[] { 19, 20, 35, 36 };
                    break;
                case 6:
                    Sector = new int?[] { 20 };
                    break;
                case 7:
                    Sector = new int?[] { 20, 28 };
                    break;
                case 8:
                    Sector = new int?[] { 29, 37, 44 };
                    break;
                case 9:
                    Sector = new int?[] { 30, 31, 32, 44 };
                    break;
                case 10:
                    Sector = new int?[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45 };
                    break;
                case 12:
                    Sector = new int?[] { 20, 28, 32 };
                    break;
                case 22:
                    Sector = new int?[] { 15, 21 };
                    break;
                case 23:
                    Sector = new int?[] { 16, 22, 24 };
                    break;
                case 24:
                    Sector = new int?[] { 22, 24, 25, 26, 40};
                    break;
                case 25:
                    Sector = new int?[] { 22,27 };
                    break;
                case 26:
                    Sector = new int?[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45 };
                    break;
            }
            try{
                if(etapaPorSectorDto.idEmp != "-1"){//Si el empleado es distinto de -1 busco solo ese empleado con el resto de los datos, como en la db es String tengo que compararlo asi.
                    List<EtapaEmpleado> EtapasEmp = new List<EtapaEmpleado>();
                    
                    if(etapaPorSectorDto.idColor == 10)
                    {
                        EtapasEmp = await _context.EtapaEmpleado.Where(x => (x.IdEtapaNavigation.DateFin >= desde && x.IdEtapaNavigation.DateFin <= hasta) && x.IdEmpleadoNavigation.IdEmpleado == etapaPorSectorDto.idEmp)
                                                        .Include(x => x.IdEmpleadoNavigation)
                                                        .Include(x => x.IdEtapaNavigation).ThenInclude(x => x.IdTransfoNavigation)
                                                        .Include(x => x.IdEtapaNavigation).ThenInclude(x => x.IdTransfoNavigation).ThenInclude(x => x.IdTipoTransfoNavigation)
                                                        .Include(x => x.IdEtapaNavigation).ThenInclude(x => x.IdTipoEtapaNavigation)
                                                        .Include(x => x.IdEtapaNavigation).ThenInclude(x => x.EtapaEmpleado).ThenInclude(x => x.IdEmpleadoNavigation)
                                                        .ToListAsync();
                    }
                    else{
                        EtapasEmp = await _context.EtapaEmpleado.Where(x => (x.IdEtapaNavigation.DateIni >= desde && x.IdEtapaNavigation.DateIni <= hasta) && x.IdEmpleadoNavigation.IdEmpleado == etapaPorSectorDto.idEmp)
                                                        .Include(x => x.IdEmpleadoNavigation)
                                                        .Include(x => x.IdEtapaNavigation).ThenInclude(x => x.IdTransfoNavigation)
                                                        .Include(x => x.IdEtapaNavigation).ThenInclude(x => x.IdTransfoNavigation).ThenInclude(x => x.IdTipoTransfoNavigation)
                                                        .Include(x => x.IdEtapaNavigation).ThenInclude(x => x.IdTipoEtapaNavigation)
                                                        .Include(x => x.IdEtapaNavigation).ThenInclude(x => x.EtapaEmpleado).ThenInclude(x => x.IdEmpleadoNavigation)
                                                        .ToListAsync();
                    }
                    
                    EtapasEmp = EtapasEmp.OrderBy(x => newOrder.IndexOf(x.IdEtapaNavigation.IdTipoEtapa.Value)).ToList();
                    foreach(EtapaEmpleado e in EtapasEmp)//Despues de agarrar las etapas, segun el sector que corresponda, armo lo que voy a devolver en una lista de ReportesDTO
                    {
                        ReportesDTO reporte = new ReportesDTO();//Creo un ReportesDTO para ir cargandole los datos. La lista esta inicializada al principio del metodo.
                        reporte.OPE = e.IdEtapaNavigation.IdTransfoNavigation.OPe;
                        reporte.OTE = e.IdEtapaNavigation.IdTransfoNavigation.OTe;
                        reporte.Rango = e.IdEtapaNavigation.IdTransfoNavigation.RangoInicio;
                        reporte.Proceso = AsignarEtapa(e.IdEtapaNavigation.IdTipoEtapa);
                        reporte.RefProceso = e.IdEtapaNavigation.NumEtapa;
                        reporte.FechaIni = e.IdEtapaNavigation.DateIni;
                        reporte.FechaFin = e.IdEtapaNavigation.DateFin;
                        reporte.TiempoParc = e.TiempoParc;
                        reporte.Operarios = "";
                        reporte.Observacion = e.IdEtapaNavigation.IdTransfoNavigation.Observaciones;
                        reporte.Potencia = e.IdEtapaNavigation.IdTransfoNavigation.Potencia;
                        reporte.TipoTrafo = e.IdEtapaNavigation.IdTransfoNavigation.IdTipoTransfoNavigation.NombreTipoTransfo;
                        foreach(EtapaEmpleado etapaEmp in e.IdEtapaNavigation.EtapaEmpleado)// Como puede tener mas de 1 empleado hago un foreach y voy concatenando los nombres.
                        {
                            if(reporte.Operarios == "")
                            {
                                reporte.Operarios = etapaEmp.IdEmpleadoNavigation.NombreEmp+" Leg: "+etapaEmp.IdEmpleadoNavigation.Legajo;
                            }
                            else{
                                reporte.Operarios = reporte.Operarios + ", " + etapaEmp.IdEmpleadoNavigation.NombreEmp+" Leg: "+etapaEmp.IdEmpleadoNavigation.Legajo;
                            }
                        }
                        EtapasResponse.Add(reporte);//Agrego el DTO a la lista
                    }
                }
                else if (etapaPorSectorDto.IdSect < 0 || etapaPorSectorDto.IdSect == 10){//Si no entro en el anterior significa que quiere todos los empleados, entonces arranco a filtrar por sectores, en este caso negativo o admin son todos los sectores.
                    
                    if(etapaPorSectorDto.idColor == 10){
                        etapas = await _context.Etapa.Where(x => x.DateFin >= desde && x.DateFin <= hasta)
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.IdTransfoNavigation).ThenInclude(x => x.IdTipoTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();                    
                    }
                    else{
                        etapas = await _context.Etapa.Where(x => x.DateIni >= desde && x.DateIni <= hasta)
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.IdTransfoNavigation).ThenInclude(x => x.IdTipoTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();                    
                    }
                    
                }
                else{//Si tampoco entro en el anterior significa que quiere un sector especifico con todos los empleados, asique empiezo a filtrar por idSector.
                    if(etapaPorSectorDto.idColor == 10){
                        etapas = await _context.Etapa.Where(x =>  (x.DateFin >= desde && x.DateFin <= hasta ) && Sector.Contains(x.IdTipoEtapa))
                                    .Include(x => x.IdTipoEtapaNavigation)
                                    .Include(x => x.IdTransfoNavigation)
                                    .Include(x => x.IdTransfoNavigation).ThenInclude(x => x.IdTipoTransfoNavigation)
                                    .Include(x => x.EtapaEmpleado)
                                    .ThenInclude(x => x.IdEmpleadoNavigation)
                                    .ToListAsync();
                    }
                    else{
                        etapas = await _context.Etapa.Where(x =>  (x.DateIni >= desde && x.DateIni <= hasta ) && Sector.Contains(x.IdTipoEtapa))
                                .Include(x => x.IdTipoEtapaNavigation)
                                .Include(x => x.IdTransfoNavigation)
                                .Include(x => x.IdTransfoNavigation).ThenInclude(x => x.IdTipoTransfoNavigation)
                                .Include(x => x.EtapaEmpleado)
                                .ThenInclude(x => x.IdEmpleadoNavigation)
                                .ToListAsync();
                    }                     
                }
                
                etapas = etapas.OrderBy(x => newOrder.IndexOf(x.IdTipoEtapa.Value)).ToList();
                foreach(Etapa e in etapas)//Despues de agarrar las etapas, segun el sector que corresponda, armo lo que voy a devolver en una lista de ReportesDTO
                {
                    ReportesDTO reporte = new ReportesDTO();//Creo un ReportesDTO para ir cargandole los datos. La lista esta inicializada al principio del metodo.
                    reporte.OPE = e.IdTransfoNavigation.OPe;
                    reporte.OTE = e.IdTransfoNavigation.OTe;
                    reporte.Rango = e.IdTransfoNavigation.RangoInicio;
                    reporte.Proceso = AsignarEtapa(e.IdTipoEtapa);
                    reporte.RefProceso = e.NumEtapa;
                    reporte.FechaIni = e.DateIni;
                    reporte.FechaFin = e.DateFin;
                    reporte.TiempoParc = (e.IdColor==9) ? e.TiempoParc : (e.IdColor==1030) ? "Iniciado" : e.TiempoFin;
                    reporte.Operarios = "";
                    reporte.Observacion = e.IdTransfoNavigation.Observaciones;
                    reporte.Potencia = e.IdTransfoNavigation.Potencia;
                    reporte.TipoTrafo = e.IdTransfoNavigation.IdTipoTransfoNavigation.NombreTipoTransfo;
                    foreach(EtapaEmpleado etapaEmp in e.EtapaEmpleado)// Como puede tener mas de 1 empleado hago un foreach y voy concatenando los nombres.
                    {
                        if(reporte.Operarios == "")
                        {
                            reporte.Operarios = etapaEmp.IdEmpleadoNavigation.NombreEmp+" Leg: "+etapaEmp.IdEmpleadoNavigation.Legajo;
                        }
                        else{
                            reporte.Operarios = reporte.Operarios + ", " + etapaEmp.IdEmpleadoNavigation.NombreEmp+" Leg: "+etapaEmp.IdEmpleadoNavigation.Legajo;
                        }
                    }
                    EtapasResponse.Add(reporte);//Agrego el DTO a la lista
                }

                r.Status = 200;
                r.Message = "Se realizo la consulta con exito.";
                r.Data = EtapasResponse;//Agrego la lista al data del response. El response en si esta inicializado al principio del metodo.
                
                return Ok(r);//Devuelvo que salio todo josha junto con el response (r).
            }catch(Exception e){//Si pincha devuelvo mensaje de error
                r.Message = e.Message;
                r.Status = 409;
                return Conflict(r);
            }
        }
            
        [HttpGet("GetEtapasTrafoIndividual/{idTransfo}")]
        public async Task<IActionResult> GetEtapasTrafoIndividual([FromRoute] int idTransfo){
            Response<List<ReportesDTO>> r = new Response<List<ReportesDTO>>();
            List<ReportesDTO> EtapasResponse = new List<ReportesDTO>();
            //fede saco el 14 para sacar ensamblaje y bobinas
            List<int> newOrder = new List<int>() { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,14, 15, 16, 17, 33, 34, 18, 19, 35, 36, 37, 20, 21, 23, 43, 24, 25, 26, 27, 38, 39, 22, 40, 41, 42, 28, 29, 44, 30, 31, 45, 32 };
            try{
                List<Etapa> etapas =  await _context.Etapa.Where(x =>  x.IdTransfo == idTransfo)//Busco las etapas del trafo que me pide.
                                    .Include(x => x.IdTipoEtapaNavigation)
                                    .Include(x => x.IdTransfoNavigation)
                                    .Include(x => x.IdColorNavigation)
                                    .Include(x => x.EtapaEmpleado)
                                    .ThenInclude(x => x.IdEmpleadoNavigation)
                                    .ToListAsync();
                etapas = etapas.Where(x=>x.IdTipoEtapa!=14).OrderBy(x => newOrder.IndexOf(x.IdTipoEtapa.Value)).ToList();
                foreach(Etapa e in etapas)//Recorro las etapas y voy armando los ReportesDTO para devolver.
                {
                    ReportesDTO reporte = new ReportesDTO();
                    reporte.OPE = e.IdTransfoNavigation.OPe;
                    reporte.OTE = e.IdTransfoNavigation.OTe;
                    reporte.Rango = e.IdTransfoNavigation.RangoInicio;
                    reporte.Proceso = AsignarEtapa(e.IdTipoEtapa);
                    reporte.RefProceso = e.NumEtapa;
                    reporte.FechaIni = e.DateIni;
                    reporte.FechaFin = e.DateFin;
                    reporte.TiempoParc = (e.IdColor==9) ? e.TiempoParc : (e.IdColor==1030) ? "Iniciado" : (e.IdColor == 10) ? e.TiempoFin : (e.IdColor==null || e.IdColor == 1069) ? "Sin Iniciar" : e.IdColorNavigation.Leyenda;
                    reporte.Operarios = "";
                    reporte.ultimoUsuario = e.UltimoUsuario;
                    reporte.fechaUltimaModificacion = e.FechaUltimaModificacion;
                    foreach(EtapaEmpleado etapaEmp in e.EtapaEmpleado)// Como puede tener mas de 1 empleado hago un foreach y voy concatenando los nombres.
                    {
                        if(reporte.Operarios == "")
                        {
                            reporte.Operarios = etapaEmp.IdEmpleadoNavigation.NombreEmp;
                        }
                        else{
                            reporte.Operarios = reporte.Operarios + ", " + etapaEmp.IdEmpleadoNavigation.NombreEmp;
                        }
                    }
                    EtapasResponse.Add(reporte);//Agrego el DTO a la lista
                }
                
                r.Status = 200;
                r.Message = "Se realizo la consulta con exito.";
                r.Data = EtapasResponse;
                
                return Ok(r);//Devuelvo el mensaje con la lista de ReportesDTO.
            }catch(Exception e){//Si pincha devuelvo mensaje de error
                r.Message = e.Message;
                r.Status = 409;
                return Conflict(r);
            }

        }
        private string AsignarEtapa(int? etapa)
        {
            switch(etapa){
                case 1:
                    return "DOC";
                case 2:
                    return "BT1";
                case 3:
                    return "BT2";
                case 4:
                    return "BT3";
                case 5:
                    return "AT1";
                case 6:
                    return "AT2";
                case 7:
                    return "AT3";
                case 8:
                    return "RG1";
                case 9:
                    return "RG2";
                case 10:
                    return "RG3";
                case 11:
                    return "RF1";
                case 12:
                    return "RF2";
                case 13:
                    return "RF3";
                case 14:
                    return "ENS";
                case 15:
                    return "PY CYP";
                case 16:
                    return "PY SOL";
                case 17:
                    return "PY ENV";
                case 18:
                    return "NUC";
                case 19:
                    return "MON";
                case 20:
                    return "HOR";
                case 21:
                    return "CUBA CYP";
                case 22:
                    return "SOL TAPA";
                case 23:
                    return "RAD PAN";
                case 24:
                    return "SOL CUBA";
                case 25:
                    return "HERM";
                case 26:
                    return "GRAN CUBA";
                case 27:
                    return "PINT CUBA";
                case 28:
                    return "ENC";
                case 29:
                    return "LAB";
                case 30:
                    return "TERM";
                case 31:
                    return "APR";
                case 32:
                    return "ENV";
                case 33:
                    return "CYP PAT";
                case 34:
                    return "PAT ENV";
                case 35:
                    return "CON BT";
                case 36:
                    return "CON AT";
                case 37:
                    return "REL TRA";
                case 38:
                    return "ENV CUBA";
                case 39:
                    return "CYP TAPA";
                case 40:
                    return "GRAN TAPA";
                case 41:
                    return "PINT TAPA";
                case 42:
                    return "ENV TAPA";
                case 43:
                    return "CUBI";
                case 44:
                    return "CH. CAR";
                case 45:
                    return "PAGO";
                default:
                    return "";
            }
        }

        [HttpGet("AddEtapasNuevasATrafosViejos")]
        public async Task<IActionResult> AddEtapasNuevasATrafosViejos()//NO FALLA! :)
        {
            Response<string> r = new Response<string>(); 
            List<Transformadores> trafos = new List<Transformadores>();
            trafos = _context.Transformadores.Include(x => x.Etapa).ToList();
            DateTime FechaActual = DateTime.Now;
            foreach(Transformadores t in trafos)
            {   
                Etapa Pagos = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 45};
                // if(t.Etapa.First(x => x.IdTipoEtapa == 32).IsEnded == true || t.Etapa.First(x => x.IdTipoEtapa == 32).IdColor == 10)
                // {
                //     Pagos.IsEnded = true;
                //     Pagos.IdColor = 10;
                //     Pagos.DateFin = DateTime.Today;
                // }
                _context.Etapa.Add(Pagos);
                // DateTime FechaFin = t.Etapa.First(x => x.IdTipoEtapa == 31).DateFin.GetValueOrDefault();
                // if(FechaFin != null ){
                //     if((FechaActual - FechaFin).TotalDays >= 60)
                //     {
                //         ChapaCaracteristicas.IsEnded = true;
                //         ChapaCaracteristicas.IdColor = 10;
                //         ChapaCaracteristicas.DateFin = DateTime.Today;
                //     }
                // }
                // _context.Etapa.Add(ChapaCaracteristicas);
                // if(t.IdTipoTransfo == 2){
                //     Etapa CyPPatas = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 33};
                //     Etapa ENVPatas = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 34};
                //     if(t.Etapa.First(x => x.IdTipoEtapa == 18).IsEnded == true || t.Etapa.First(x => x.IdTipoEtapa == 18).IdColor == 10)
                //     {
                //         CyPPatas.IsEnded = true;
                //         CyPPatas.IdColor = 10;
                //         CyPPatas.DateFin = DateTime.Today;
                //         ENVPatas.IsEnded = true;
                //         ENVPatas.IdColor = 10;
                //         ENVPatas.DateFin = DateTime.Today;
                //     }
                //     Etapa ConexBT = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 35};
                //     Etapa ConexAT = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 36};
                //     if(t.Etapa.First(x => x.IdTipoEtapa == 19).IsEnded == true || t.Etapa.First(x => x.IdTipoEtapa == 19).IdColor == 10)
                //     {
                //         ConexBT.IsEnded = true;
                //         ConexBT.IdColor = 10;
                //         ConexBT.DateFin = DateTime.Today;
                //         ConexAT.IsEnded = true;
                //         ConexAT.IdColor = 10;
                //         ConexAT.DateFin = DateTime.Today;
                //     }
                //     Etapa RelacTransf = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 37};
                //     if(t.Etapa.First(x => x.IdTipoEtapa == 20).IsEnded == true || t.Etapa.First(x => x.IdTipoEtapa == 20).IdColor == 10)
                //     {
                //         RelacTransf.IsEnded = true;
                //         RelacTransf.IdColor = 10;
                //         RelacTransf.DateFin = DateTime.Today;
                //     }
                //     Etapa EnvioCuba = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 38, IdColor = 1034, IsEnded = true};
                //     Etapa CyPTapa = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 39, IdColor = 1034, IsEnded = true };
                //     Etapa GranalladoTapa = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 40, IdColor = 1034, IsEnded = true};
                //     Etapa PinturaTapa = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 41, IdColor = 1034, IsEnded = true};
                //     Etapa EnvioTapa = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 42, IdColor = 1034, IsEnded = true};
                //     Etapa Cubierta = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 43, IdColor = 1034, IsEnded = true};
                //     _context.Etapa.Add(CyPPatas);
                //     _context.Etapa.Add(ENVPatas);
                //     _context.Etapa.Add(ConexBT);
                //     _context.Etapa.Add(ConexAT);
                //     _context.Etapa.Add(RelacTransf);
                //     _context.Etapa.Add(EnvioCuba);
                //     _context.Etapa.Add(CyPTapa);
                //     _context.Etapa.Add(GranalladoTapa);
                //     _context.Etapa.Add(PinturaTapa);
                //     _context.Etapa.Add(EnvioTapa);
                //     _context.Etapa.Add(Cubierta);
                // }
                // else if(t.IdTipoTransfo == 3 || t.IdTipoTransfo == 4){
                //     Etapa CyPPatas = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 33};
                //     Etapa ENVPatas = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 34};
                //     if(t.Etapa.First(x => x.IdTipoEtapa == 18).IsEnded == true || t.Etapa.First(x => x.IdTipoEtapa == 18).IdColor == 10)
                //     {
                //         CyPPatas.IsEnded = true;
                //         CyPPatas.IdColor = 10;
                //         CyPPatas.DateFin = DateTime.Today;
                //         ENVPatas.IsEnded = true;
                //         ENVPatas.IdColor = 10;
                //         ENVPatas.DateFin = DateTime.Today;
                //     }
                //     Etapa ConexBT = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 35};
                //     Etapa ConexAT = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 36};
                //     if(t.Etapa.First(x => x.IdTipoEtapa == 19).IsEnded == true || t.Etapa.First(x => x.IdTipoEtapa == 19).IdColor == 10)
                //     {
                //         ConexBT.IsEnded = true;
                //         ConexBT.IdColor = 10;
                //         ConexBT.DateFin = DateTime.Today;
                //         ConexAT.IsEnded = true;
                //         ConexAT.IdColor = 10;
                //         ConexAT.DateFin = DateTime.Today;
                //     }
                //     Etapa RelacTransf = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 37};
                //     if(t.Etapa.First(x => x.IdTipoEtapa == 20).IsEnded == true || t.Etapa.First(x => x.IdTipoEtapa == 20).IdColor == 10)
                //     {
                //         RelacTransf.IsEnded = true;
                //         RelacTransf.IdColor = 10;
                //         RelacTransf.DateFin = DateTime.Today;
                //     }
                //     Etapa EnvioCuba = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 38};
                //     Etapa EnvioTapa = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 42};
                //     if(t.Etapa.First(x => x.IdTipoEtapa == 28).IsEnded == true || t.Etapa.First(x => x.IdTipoEtapa == 28).IdColor == 10)
                //     {
                //         EnvioCuba.IsEnded = true;
                //         EnvioCuba.IdColor = 10;
                //         EnvioCuba.DateFin = DateTime.Today;
                //         EnvioTapa.IsEnded = true;
                //         EnvioTapa.IdColor = 10;
                //         EnvioTapa.DateFin = DateTime.Today;
                //     }
                //     Etapa CyPTapa = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 39};
                //     Etapa GranalladoTapa = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 40};
                //     Etapa PinturaTapa = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 41};
                //     if(t.Etapa.First(x => x.IdTipoEtapa == 22).IsEnded == true || t.Etapa.First(x => x.IdTipoEtapa == 22).IdColor == 10)
                //     {
                //         CyPTapa.IsEnded = true;
                //         CyPTapa.IdColor = 10;
                //         CyPTapa.DateFin = DateTime.Today;
                //         GranalladoTapa.IsEnded = true;
                //         GranalladoTapa.IdColor = 10;
                //         GranalladoTapa.DateFin = DateTime.Today;
                //         PinturaTapa.IsEnded = true;
                //         PinturaTapa.IdColor = 10;
                //         PinturaTapa.DateFin = DateTime.Today;
                //     }
                //     Etapa Cubierta = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 43, IdColor = 1034, IsEnded = true};
                //     _context.Etapa.Add(CyPPatas);
                //     _context.Etapa.Add(ENVPatas);
                //     _context.Etapa.Add(ConexBT);
                //     _context.Etapa.Add(ConexAT);
                //     _context.Etapa.Add(RelacTransf);
                //     _context.Etapa.Add(EnvioCuba);
                //     _context.Etapa.Add(CyPTapa);
                //     _context.Etapa.Add(GranalladoTapa);
                //     _context.Etapa.Add(PinturaTapa);
                //     _context.Etapa.Add(EnvioTapa);
                //     _context.Etapa.Add(Cubierta);
                // }
                // else if(t.IdTipoTransfo == 5){
                //     Etapa CyPPatas = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 33};
                //     Etapa ENVPatas = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 34};
                //     if(t.Etapa.First(x => x.IdTipoEtapa == 18).IsEnded == true || t.Etapa.First(x => x.IdTipoEtapa == 18).IdColor == 10)
                //     {
                //         CyPPatas.IsEnded = true;
                //         CyPPatas.IdColor = 10;
                //         CyPPatas.DateFin = DateTime.Today;
                //         ENVPatas.IsEnded = true;
                //         ENVPatas.IdColor = 10;
                //         ENVPatas.DateFin = DateTime.Today;
                //     }
                //     Etapa ConexBT = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 35};
                //     Etapa ConexAT = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 36};
                //     if(t.Etapa.First(x => x.IdTipoEtapa == 19).IsEnded == true || t.Etapa.First(x => x.IdTipoEtapa == 19).IdColor == 10)
                //     {
                //         ConexBT.IsEnded = true;
                //         ConexBT.IdColor = 10;
                //         ConexBT.DateFin = DateTime.Today;
                //         ConexAT.IsEnded = true;
                //         ConexAT.IdColor = 10;
                //         ConexAT.DateFin = DateTime.Today;
                //     }
                //     Etapa RelacTransf = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 37};
                //     if(t.Etapa.First(x => x.IdTipoEtapa == 20).IsEnded == true || t.Etapa.First(x => x.IdTipoEtapa == 20).IdColor == 10)
                //     {
                //         RelacTransf.IsEnded = true;
                //         RelacTransf.IdColor = 10;
                //         RelacTransf.DateFin = DateTime.Today;
                //     }
                //     Etapa EnvioCuba = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 38};
                //     Etapa EnvioTapa = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 42};
                //     if(t.Etapa.First(x => x.IdTipoEtapa == 28).IsEnded == true || t.Etapa.First(x => x.IdTipoEtapa == 28).IdColor == 10)
                //     {
                //         EnvioCuba.IsEnded = true;
                //         EnvioCuba.IdColor = 10;
                //         EnvioCuba.DateFin = DateTime.Today;
                //         EnvioTapa.IsEnded = true;
                //         EnvioTapa.IdColor = 10;
                //         EnvioTapa.DateFin = DateTime.Today;
                //     }
                //     Etapa CyPTapa = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 39};
                //     Etapa GranalladoTapa = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 40};
                //     Etapa PinturaTapa = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 41};
                //     if(t.Etapa.First(x => x.IdTipoEtapa == 22).IsEnded == true || t.Etapa.First(x => x.IdTipoEtapa == 22).IdColor == 10)
                //     {
                //         CyPTapa.IsEnded = true;
                //         CyPTapa.IdColor = 10;
                //         CyPTapa.DateFin = DateTime.Today;
                //         GranalladoTapa.IsEnded = true;
                //         GranalladoTapa.IdColor = 10;
                //         GranalladoTapa.DateFin = DateTime.Today;
                //         PinturaTapa.IsEnded = true;
                //         PinturaTapa.IdColor = 10;
                //         PinturaTapa.DateFin = DateTime.Today;
                //     }
                //     Etapa Cubierta = new Etapa(){IdTransfo = t.IdTransfo, IdTipoEtapa = 43};
                //     if(t.Etapa.First(x => x.IdTipoEtapa == 24).IsEnded == true || t.Etapa.First(x => x.IdTipoEtapa == 24).IdColor == 10)
                //     {
                //         Cubierta.IsEnded = true;
                //         Cubierta.IdColor = 10;
                //         Cubierta.DateFin = DateTime.Today;
                //     }
                //     _context.Etapa.Add(CyPPatas);
                //     _context.Etapa.Add(ENVPatas);
                //     _context.Etapa.Add(ConexBT);
                //     _context.Etapa.Add(ConexAT);
                //     _context.Etapa.Add(RelacTransf);
                //     _context.Etapa.Add(EnvioCuba);
                //     _context.Etapa.Add(CyPTapa);
                //     _context.Etapa.Add(GranalladoTapa);
                //     _context.Etapa.Add(PinturaTapa);
                //     _context.Etapa.Add(EnvioTapa);
                //     _context.Etapa.Add(Cubierta);
                // }                
            }
            try{
                await _context.SaveChangesAsync();
                r.Message = "Se agregaron las etapas con exito";
                r.Status = 200;
                r.Data = "Se agregaron las etapas con exito";
                return Ok(r);
            }
            catch(Exception e){
                r.Message = e.Message;
                r.Status = 409;
                return Conflict(r);
            }
        }

        [HttpGet("GetTrafoSinEtapas")]
        public async Task<IActionResult> GetTrafoSinEtapas()//NO FALLA! :)
        {
            Response<Transformadores> r = new Response<Transformadores>();
            Transformadores t = new Transformadores();
            t = await _context.Transformadores.Where(x => x.Etapa.Where(z => z.IdTipoEtapa == 43).Count() == 0).Include(x => x.Etapa).FirstAsync();
            r.Message = t.IdTransfo.ToString();
            r.Status = 200;
            r.Data = t;
            return Ok(r);

        }

        [HttpGet("ChequearHorno")]
        public async Task<IActionResult> ChequearHorno(){
            Response<String> r = new Response<string>();
            List<Etapa> etapasHorno = await _context.Etapa.AsNoTracking().Where(x => x.IdTipoEtapa == 20 && x.IdColor == 1030 && x.TiempoParc != "Finalizada" && (x.IsEnded == false || x.IsEnded == null)).Include(x => x.IdTipoEtapaNavigation).ToListAsync();//.Include(x => x.EtapaEmpleado)
            DateTime fechaActual = DateTime.Now;
            foreach(Etapa e in etapasHorno)
            {
                if((fechaActual - e.DateIni.GetValueOrDefault(DateTime.Now)).TotalHours >= 72){
                    e.DateFin = fechaActual;
                    e.IsEnded = true;
                    e.IdColor = 10;
                    //Ultimo usuario y fecha de ultima modificacion
                    e.UltimoUsuario = "Sistema";
                    e.FechaUltimaModificacion = DateTime.Now;
                    //Termina Ultimo usuario y fecha de ultima modificacion
                    var editDTO = _mapper.Map<EditEtapaDto>(e);
                    editDTO.EtapaEmpleado = _context.EtapaEmpleado.AsNoTracking().Where(x => x.IdEtapa == e.IdEtapa).ToList();                  
                    await PutEtapaStop(e.IdEtapa, editDTO);
                    //_context.Etapa.Update(e);
                }
            }
            try{
                await _context.SaveChangesAsync();
                r.Message = "Se actualizaron las etapas del tipo Horno.";
                r.Status = 200;
                return Ok(r);
            }catch(Exception e){
                r.Message = e.Message;
                r.Status = 500;
                return Conflict(r);
            }
        }

        private async void PutEtapaPausaNoTask(int id, EditEtapaDto editEtapaDto)
        {
            var etapaAntes=_context.Etapa.AsNoTracking().First(x=>x.IdEtapa==id);
            editEtapaDto.DateIni=etapaAntes.DateIni;
            editEtapaDto.FechaPausa=DateTime.Now;
            //chequeo si es el primer comienzo
            if(etapaAntes.InicioProceso==null)
            {
                //Tiempo parcial 
                TimeSpan preEtapaTiempoParc = (DateTime.Now - DateTime.Parse(etapaAntes.TiempoParc));
                
                foreach(var a in editEtapaDto.EtapaEmpleado)
                {
                    
                    //Calculo el nuevo tiempo para el empleado encontrado
                    a.DateIni=etapaAntes.DateIni;
                    a.TiempoParc=preEtapaTiempoParc.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                    var preEtapaEmpleado=_mapper.Map<EtapaEmpleado>(a);
                    try{
                        _repo2.Update(preEtapaEmpleado);
                        await _repo2.SaveAsync(preEtapaEmpleado);
                    }
                    catch(DbUpdateConcurrencyException){
                        throw;
                    }

                }

                editEtapaDto.TiempoParc = preEtapaTiempoParc.Multiply(editEtapaDto.EtapaEmpleado.Count()).ToString(@"dd\:hh\:mm\:ss");

            }
            else{
                //calculo el nuevo intervalo 
                TimeSpan preEtapaTiempoParc = (TimeSpan)(DateTime.Now - etapaAntes.InicioProceso);
                foreach(var a in editEtapaDto.EtapaEmpleado)
                {
                    var isEtapaEmpleadoAntes=_context.EtapaEmpleado.AsNoTracking().First(x=>x.IdEmpleado==a.IdEmpleado && x.IdEtapa==a.IdEtapa);
                    TimeSpan tiempoParcial=(TimeSpan.ParseExact(isEtapaEmpleadoAntes.TiempoParc,"dd\\:hh\\:mm\\:ss",CultureInfo.InvariantCulture)).Add(preEtapaTiempoParc);
                    a.TiempoParc=tiempoParcial.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                    a.DateIni=editEtapaDto.DateIni;
                    var preEtapaEmpleado=_mapper.Map<EtapaEmpleado>(a);
                    try{
                        _repo2.Update(preEtapaEmpleado);
                        await _repo2.SaveAsync(preEtapaEmpleado);
                    }
                    catch(DbUpdateConcurrencyException){
                        throw;
                    }
                }
                
                var horasHombre=preEtapaTiempoParc.Multiply(editEtapaDto.EtapaEmpleado.Count());
                TimeSpan suma = new TimeSpan();
                var prueba=etapaAntes.TiempoParc;
                var prueba2=horasHombre;
                suma=TimeSpan.ParseExact(etapaAntes.TiempoParc,"dd\\:hh\\:mm\\:ss",CultureInfo.InvariantCulture).Add(horasHombre);
                editEtapaDto.TiempoParc=suma.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
            }

            //Ultimo usuario y fecha de ultima modificacion
            var accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(accessToken);
            editEtapaDto.UltimoUsuario = jwtSecurityToken.Claims.ElementAt(1).Value;
            editEtapaDto.FechaUltimaModificacion = DateTime.Now;
            //Termina Ultimo usuario y fecha de ultima modificacion

            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);
            _repo.Update(preEtapa);
            await _repo.SaveAsync(preEtapa);
        } 

        [HttpGet("PausarIniciadasViejas")]
        public async Task<ActionResult> PausarIniciadasViejas()
        {
            DateTime FechaLimite = DateTime.Today.AddDays(-30);
            try{
                List<Etapa> EtapasIniciadas = _context.Etapa.AsNoTracking().Where(x => x.IdColor == 1030 && x.DateIni <= FechaLimite).Include(x => x.IdTipoEtapaNavigation).ToList();
                //List<int> lista = new List<int>();
                string lista = "";
                foreach(Etapa e in EtapasIniciadas){
                    e.IdColor = 9;
                    e.FechaPausa = DateTime.Now;
                    if(e.TiempoParc == "Finalizada"){
                        var editDTO = _mapper.Map<EditEtapaDto>(e);
                        await PutEtapaStop(e.IdEtapa, editDTO);
                    }
                    else if(e.DateIni.Value.Year < 2023){
                        if(e.TiempoFin != null){
                            e.TiempoParc = e.DateFin.Value.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                            var editDTO = _mapper.Map<EditEtapaDto>(e);
                            await PutEtapaStop(e.IdEtapa, editDTO); 
                            if(lista == ""){
                                lista = "Trafo: " + e.IdTransfo + " Proceso: " + e.IdEtapa + " Tipo: " + e.IdTipoEtapaNavigation.Abrev + " - Finalizada";
                            }
                            lista = lista + " // Trafo: " + e.IdTransfo + " Proceso: " + e.IdEtapa + " Tipo: " + e.IdTipoEtapaNavigation.Abrev + " - Finalizada";
                        }
                        else{
                            e.TiempoParc = e.DateIni.Value.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                            var editDTO = _mapper.Map<EditEtapaDto>(e);
                            await PutEtapaPausa(e.IdEtapa, editDTO); 
                            if(lista == ""){
                                lista = "Trafo: " + e.IdTransfo + " Proceso: " + e.IdEtapa + " Tipo: " + e.IdTipoEtapaNavigation.Abrev + " - Pausada";
                            }
                            lista = lista + " // Trafo: " + e.IdTransfo + " Proceso: " + e.IdEtapa + " Tipo: " + e.IdTipoEtapaNavigation.Abrev + " - Pausada";
                        }
                    }
                    else{
                        if(e.DateFin != null){
                            if(e.TiempoParc == null){
                                e.TiempoParc = e.DateFin.Value.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);    
                            }
                            var editDTO = _mapper.Map<EditEtapaDto>(e);
                            await PutEtapaStop(e.IdEtapa, editDTO);
                            if(lista == ""){
                                lista = "Trafo: " + e.IdTransfo + " Proceso: " + e.IdEtapa + " Tipo: " + e.IdTipoEtapaNavigation.Abrev + " - Finalizada";
                            }
                            lista = lista + " // Trafo: " + e.IdTransfo + " Proceso: " + e.IdEtapa + " Tipo: " + e.IdTipoEtapaNavigation.Abrev + " - Finalizada";
                        }
                        else{
                            if(e.TiempoParc == null){
                                e.TiempoParc = e.DateIni.Value.ToString(@"dd\:hh\:mm\:ss",CultureInfo.InvariantCulture);
                            }
                            var editDTO = _mapper.Map<EditEtapaDto>(e);
                            await PutEtapaPausa(e.IdEtapa, editDTO);
                            if(lista == ""){
                                lista = "Trafo: " + e.IdTransfo + " Proceso: " + e.IdEtapa + " Tipo: " + e.IdTipoEtapaNavigation.Abrev + " - Pausada";
                            }
                            lista = lista + " // Trafo: " + e.IdTransfo + " Proceso: " + e.IdEtapa + " Tipo: " + e.IdTipoEtapaNavigation.Abrev + " - Pausada";
                        }
                    }
                }
                return Ok(lista);
            }
            catch(Exception e)
            {
                throw e;
            }
        } 
    }
}