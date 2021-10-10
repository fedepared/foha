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

namespace Foha.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EtapaController : ControllerBase
    {
        private readonly fohaContext _context;
        private readonly IMapper _mapper;
        private readonly IDataRepository<Etapa> _repo;
        private readonly IDataRepository<EtapaEmpleado> _repo2;

        public EtapaController(fohaContext context, IMapper mapper, IDataRepository<Etapa> repo,IDataRepository<EtapaEmpleado> repo2)
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
                    .Where(x=>x.IdTransfo==idTransfo && (x.IdTipoEtapa>=2 && x.IdTipoEtapa<=14) )
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
                    .Where(x=>x.IdTransfo==idTransfo && ((x.IdTipoEtapa>=15 && x.IdTipoEtapa<=17) || x.IdTipoEtapa>=21 && x.IdTipoEtapa<=27 ))
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
                    .Where(x=>x.IdTransfo==idTransfo && (x.IdTipoEtapa>=19 && x.IdTipoEtapa<=20))
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
                    // etapasPorSector.Add("DEP",31);
                    // etapasPorSector.Add("ENV",32);
                    break;
              case 10:
                    etapa = await _context.Etapa
                    .Where(x=>x.IdTransfo==idTransfo)
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
                    .Where(x=>x.IdTransfo==idTransfo && (x.IdTipoEtapa==25 || x.IdTipoEtapa==26))
                    .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation)
                    .Include(x=>x.IdColorNavigation)
                    .ToListAsync(); 
                    // etapasPorSector.Add("TINT",25);
                    // etapasPorSector.Add("GRAN",26);
                    break;
                //pintura
                case 25:
                    etapa = await _context.Etapa
                    .Where(x=>x.IdTransfo==idTransfo && (x.IdTipoEtapa==22 || x.IdTipoEtapa==27))
                    .Include(x=>x.EtapaEmpleado).ThenInclude(x=>x.IdEmpleadoNavigation)
                    .Include(x=>x.IdColorNavigation)
                    .ToListAsync(); 
                    // etapasPorSector.Add("TAPA",22);
                    // etapasPorSector.Add("PINT",27);
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

            // if (id != editEtapaDto.IdEtapa)
            // {
            //     return BadRequest();
            // }
            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);
            _repo.Update(preEtapa);
            await _repo.SaveAsync(preEtapa);
            return StatusCode(201,preEtapa);
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
            foreach (var trafo in edit.ArrayTrafo)
            {
                foreach (var tipoEtapa in edit.IdTipoEtapa)
                {    
                    var referencia = _context.Colores.Find(edit.IdRef);
                    var etapa=_context.Etapa.Where(x=>x.IdTransfo == trafo).FirstOrDefault(z=>z.IdTipoEtapa==tipoEtapa);
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
                return Ok();
            }
            catch(DbUpdateException){
                throw;
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

            var etapaAnterior=_context.Etapa.AsNoTracking().First(x=>x.IdEtapa==id);
            if(etapaAnterior.IdColor==editEtapaDto.IdColor)
            {
                return Conflict("La etapa ya había sido iniciada, por favor actualice la vista");
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
            }

            

            foreach(var a in editEtapaDto.EtapaEmpleado)
            {
                
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
            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);
            
            _repo.Update(preEtapa);



            return StatusCode(201,await _repo.SaveAsync(preEtapa));
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

            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);
            _repo.Update(preEtapa);
            await _repo.SaveAsync(preEtapa);
            return StatusCode(201,preEtapa);
        }

        //Fin
        [HttpPut("{id}/stop")]
        public async Task<IActionResult> PutEtapaStop([FromRoute] int id, [FromBody] EditEtapaDto editEtapaDto)
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
                TimeSpan preEtapaTiempoParc = (DateTime.Now - DateTime.Parse(etapaAntes.TiempoParc));
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
                TimeSpan preEtapaTiempoParc = (TimeSpan)(DateTime.Now - etapaAntes.InicioProceso);
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
            
            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);

            _repo.Update(preEtapa);
            
            foreach (var a in _context.EtapaEmpleado.Where(x=>x.IdEtapa==editEtapaDto.IdEtapa))
            {
                a.DateFin=editEtapaDto.DateFin;
                a.IsEnded=true;
                a.TiempoFin=editEtapaDto.TiempoFin;
            }
            return StatusCode(201,await _repo.SaveAsync(preEtapa));
        }

        [HttpPut("{id}/stopEtapaEspecial")]
        public async Task<IActionResult> stopEtapaEspecial([FromRoute] int id, [FromBody] EditEtapaDto editEtapaDto)
        {
            var etapaAntes=_context.Etapa.AsNoTracking().First(x=>x.IdEtapa==id);
            if(etapaAntes.IdColor==editEtapaDto.IdColor)
            {
                return Conflict("La etapa ya había sido finalizada, por favor actualice la vista");
            }
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

            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);
            _repo.Update(preEtapa);
            await _repo.SaveAsync(preEtapa);
            return StatusCode(201,preEtapa);
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
            
            var preEtapa = _mapper.Map<Etapa>(editEtapaDto);

            _repo.Update(preEtapa);
            
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
                    etapasPorSector.Add("ENS",14);  
                    break;
              case 3:
                    etapasPorSector.Add("PY CYP",15);
                    etapasPorSector.Add("PY SOL",16);
                    etapasPorSector.Add("PY ENV",17);
                    etapasPorSector.Add("CUBA CYP",21);
                    etapasPorSector.Add("TAPA",22);
                    etapasPorSector.Add("RAD/PAN",23);
                    etapasPorSector.Add("CUBA",24);
                    etapasPorSector.Add("TINT",25);
                    etapasPorSector.Add("GRAN",26);
                    etapasPorSector.Add("PINT",27);
                    break;
              case 4:
                    etapasPorSector.Add("NUC",18);
                    break;
              case 5:
                    etapasPorSector.Add("MON",19);
                    etapasPorSector.Add("HOR",20);
                    break;
              case 6:
                    etapasPorSector.Add("HOR",20);
                    break;
              case 7:
                    etapasPorSector.Add("HOR",20);
                    etapasPorSector.Add("ENC",28);
                break;
              case 8:
                    etapasPorSector.Add("LAB",29);
                    break;
              case 9:                
                    etapasPorSector.Add("TERM",30);
                    etapasPorSector.Add("DEP",31);
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
                    etapasPorSector.Add("ENS",14);
                    etapasPorSector.Add("PY CYP",15);
                    etapasPorSector.Add("PY SOL",16);
                    etapasPorSector.Add("PY ENV",17);
                    etapasPorSector.Add("CUBA CYP",21);
                    etapasPorSector.Add("TAPA",22);
                    etapasPorSector.Add("RAD/PAN",23);
                    etapasPorSector.Add("CUBA",24);
                    etapasPorSector.Add("TINT",25);
                    etapasPorSector.Add("GRAN",26);
                    etapasPorSector.Add("PINT",27);
                    etapasPorSector.Add("NUC",18);
                    etapasPorSector.Add("MON",19);
                    etapasPorSector.Add("HOR",20);
                    etapasPorSector.Add("ENC",28);
                    etapasPorSector.Add("LAB",29);
                    etapasPorSector.Add("TERM",30);
                    etapasPorSector.Add("DEP",31);
                    etapasPorSector.Add("ENV",32);
                    break;
                //encubado Enc
                case 12:
                    etapasPorSector.Add("HOR",20);
                    etapasPorSector.Add("ENC",28);
                    etapasPorSector.Add("ENV",32);
                    break;

                //caldereria enc 
                case 21:
                    break;
                //cyp
                case 22:
                    etapasPorSector.Add("PY CYP",15);
                    etapasPorSector.Add("CUBA CYP",21);
                    break;
                //soldadura
                case 23:
                    etapasPorSector.Add("PY SOL",16);
                    etapasPorSector.Add("TAPA",22);
                    etapasPorSector.Add("CUBA",24);
                    break;
                //granallado
                case 24:
                    etapasPorSector.Add("TINT",25);
                    etapasPorSector.Add("GRAN",26);
                    break;
                //pintura
                case 25:
                    etapasPorSector.Add("TAPA",22);
                    etapasPorSector.Add("PINT",27);
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
            int?[] Sector1 = new int?[] { 1 };
            int?[] Sector2 = new int?[] { 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 };
            int?[] Sector3 = new int?[] { 15, 16, 17, 21, 22, 23, 24, 25, 26, 27 };
            int?[] Sector4 = new int?[] { 18 };
            int?[] Sector5 = new int?[] { 19, 20 };
            int?[] Sector6 = new int?[] { 20 };
            int?[] Sector7 = new int?[] { 20, 28 };
            int?[] Sector8 = new int?[] { 29 };
            int?[] Sector9 = new int?[] { 30, 31, 32 };
            int?[] Sector10 = new int?[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32 };
            int?[] Sector12 = new int?[] { 20, 28, 32 };
            int?[] Sector13 = new int?[] { 1 };
            int?[] Sector22 = new int?[] { 15, 21 };
            int?[] Sector23 = new int?[] { 16, 22, 24 };
            int?[] Sector24 = new int?[] { 25, 26 };
            int?[] Sector25 = new int?[] { 22,27 };

            try{
                if(etapaPorSectorDto.idEmp != "-1"){//Si el empleado es distinto de -1 busco solo ese empleado con el resto de los datos, como en la db es String tengo que compararlo asi.
                    List<EtapaEmpleado> EtapasEmp = await _context.EtapaEmpleado.Where(x => x.IdEtapaNavigation.IdColor == etapaPorSectorDto.idColor && (x.IdEtapaNavigation.DateIni >= desde && x.IdEtapaNavigation.DateIni <= hasta) && x.IdEmpleadoNavigation.IdEmpleado == etapaPorSectorDto.idEmp)
                                                        .Include(x => x.IdEmpleadoNavigation)
                                                        .Include(x => x.IdEtapaNavigation).ThenInclude(x => x.IdTransfoNavigation)
                                                        .Include(x => x.IdEtapaNavigation).ThenInclude(x => x.IdTipoEtapaNavigation)
                                                        .Include(x => x.IdEtapaNavigation).ThenInclude(x => x.EtapaEmpleado).ThenInclude(x => x.IdEmpleadoNavigation)
                                                        .ToListAsync();
                    
                    foreach(EtapaEmpleado e in EtapasEmp)//Despues de agarrar las etapas, segun el sector que corresponda, armo lo que voy a devolver en una lista de ReportesDTO
                    {
                        ReportesDTO reporte = new ReportesDTO();//Creo un ReportesDTO para ir cargandole los datos. La lista esta inicializada al principio del metodo.
                        reporte.OPE = e.IdEtapaNavigation.IdTransfoNavigation.OPe;
                        reporte.OTE = e.IdEtapaNavigation.IdTransfoNavigation.OTe;
                        reporte.Rango = e.IdEtapaNavigation.IdTransfoNavigation.RangoInicio;
                        reporte.Proceso = e.IdEtapaNavigation.IdTipoEtapaNavigation.NombreEtapa;
                        reporte.RefProceso = e.IdEtapaNavigation.NumEtapa;
                        reporte.FechaIni = e.DateIni;
                        reporte.FechaFin = e.DateFin;
                        reporte.TiempoParc = (e.IdEtapaNavigation.IdColor ==9) ? e.IdEtapaNavigation.TiempoParc : (e.IdEtapaNavigation.IdColor==1030 ) ? "Iniciado" : e.IdEtapaNavigation.TiempoFin;
                        reporte.Operarios = "";
                        foreach(EtapaEmpleado etapaEmp in e.IdEtapaNavigation.EtapaEmpleado)// Como puede tener mas de 1 empleado hago un foreach y voy concatenando los nombres.
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
                }
                else if (etapaPorSectorDto.IdSect < 0 || etapaPorSectorDto.IdSect == 10){//Si no entro en el anterior significa que quiere todos los empleados, entonces arranco a filtrar por sectores, en este caso negativo o admin son todos los sectores.
                    etapas = await _context.Etapa.Where(x => x.IdColor == etapaPorSectorDto.idColor && (x.DateIni >= desde && (x.DateIni <= hasta || etapaPorSectorDto.idColor==1030)))
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();                    
                }
                else{
                    switch(etapaPorSectorDto.IdSect){//Si tampoco entro en el anterior significa que quiere un sector especifico con todos los empleados, asique empiezo a filtrar por idSector.
                        case 1:
                            etapas = await _context.Etapa.Where(x => x.IdColor == etapaPorSectorDto.idColor && (x.DateIni >= desde && (x.DateFin <= hasta || etapaPorSectorDto.idColor==1030)) && Sector1.Contains(x.IdTipoEtapa))
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();
                            break;
                        case 2:
                            etapas = await _context.Etapa.Where(x => x.IdColor == etapaPorSectorDto.idColor && (x.DateIni >= desde && (x.DateFin <= hasta || etapaPorSectorDto.idColor==1030)) && Sector2.Contains(x.IdTipoEtapa))
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();
                            break;
                        case 3:
                            etapas = await _context.Etapa.Where(x => x.IdColor == etapaPorSectorDto.idColor && (x.DateIni >= desde && (x.DateFin <= hasta || etapaPorSectorDto.idColor==1030)) && Sector3.Contains(x.IdTipoEtapa))
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();
                            break;
                        case 4:
                            etapas = await _context.Etapa.Where(x => x.IdColor == etapaPorSectorDto.idColor && (x.DateIni >= desde && (x.DateFin <= hasta || etapaPorSectorDto.idColor==1030)) && Sector4.Contains(x.IdTipoEtapa))
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();
                            break;
                        case 5:
                            etapas = await _context.Etapa.Where(x => x.IdColor == etapaPorSectorDto.idColor && (x.DateIni >= desde && (x.DateFin <= hasta || etapaPorSectorDto.idColor==1030)) && Sector5.Contains(x.IdTipoEtapa))
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();
                            break;
                        case 6:
                            etapas = await _context.Etapa.Where(x => x.IdColor == etapaPorSectorDto.idColor && (x.DateIni >= desde && (x.DateFin <= hasta || etapaPorSectorDto.idColor==1030)) && Sector6.Contains(x.IdTipoEtapa))
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();
                            break;
                        case 7:
                            etapas = await _context.Etapa.Where(x => x.IdColor == etapaPorSectorDto.idColor && (x.DateIni >= desde && (x.DateFin <= hasta || etapaPorSectorDto.idColor==1030)) && Sector7.Contains(x.IdTipoEtapa))
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();
                            break;
                        case 8:
                            etapas = await _context.Etapa.Where(x => x.IdColor == etapaPorSectorDto.idColor && (x.DateIni >= desde && (x.DateFin <= hasta || etapaPorSectorDto.idColor==1030)) && Sector8.Contains(x.IdTipoEtapa))
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();
                            break;
                        case 9:
                            etapas = await _context.Etapa.Where(x => x.IdColor == etapaPorSectorDto.idColor && (x.DateIni >= desde && (x.DateFin <= hasta || etapaPorSectorDto.idColor==1030)) && Sector9.Contains(x.IdTipoEtapa))
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();
                            break;
                        case 12:
                            etapas = await _context.Etapa.Where(x => x.IdColor == etapaPorSectorDto.idColor && (x.DateIni >= desde && (x.DateFin <= hasta || etapaPorSectorDto.idColor==1030)) && Sector12.Contains(x.IdTipoEtapa))
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();
                            break;
                        case 22:
                            etapas = await _context.Etapa.Where(x => x.IdColor == etapaPorSectorDto.idColor && (x.DateIni >= desde && (x.DateFin <= hasta || etapaPorSectorDto.idColor==1030)) && Sector22.Contains(x.IdTipoEtapa))
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();
                            break;
                        case 23:
                            etapas = await _context.Etapa.Where(x => x.IdColor == etapaPorSectorDto.idColor && (x.DateIni >= desde && (x.DateFin <= hasta || etapaPorSectorDto.idColor==1030)) && Sector23.Contains(x.IdTipoEtapa))
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();
                            break;
                        case 24:
                            etapas = await _context.Etapa.Where(x => x.IdColor == etapaPorSectorDto.idColor && (x.DateIni >= desde && (x.DateFin <= hasta || etapaPorSectorDto.idColor==1030)) && Sector24.Contains(x.IdTipoEtapa))
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();
                            break;
                        case 25:
                            etapas = await _context.Etapa.Where(x => x.IdColor == etapaPorSectorDto.idColor && (x.DateIni >= desde && (x.DateFin <= hasta || etapaPorSectorDto.idColor==1030)) && Sector25.Contains(x.IdTipoEtapa))
                                        .Include(x => x.IdTipoEtapaNavigation)
                                        .Include(x => x.IdTransfoNavigation)
                                        .Include(x => x.EtapaEmpleado)
                                        .ThenInclude(x => x.IdEmpleadoNavigation)
                                        .ToListAsync();
                            break;
                    }
                }

                foreach(Etapa e in etapas)//Despues de agarrar las etapas, segun el sector que corresponda, armo lo que voy a devolver en una lista de ReportesDTO
                {
                    ReportesDTO reporte = new ReportesDTO();//Creo un ReportesDTO para ir cargandole los datos. La lista esta inicializada al principio del metodo.
                    reporte.OPE = e.IdTransfoNavigation.OPe;
                    reporte.OTE = e.IdTransfoNavigation.OTe;
                    reporte.Rango = e.IdTransfoNavigation.RangoInicio;
                    reporte.Proceso = e.IdTipoEtapaNavigation.NombreEtapa;
                    reporte.RefProceso = e.NumEtapa;
                    reporte.FechaIni = e.DateIni;
                    reporte.FechaFin = e.DateFin;
                    reporte.TiempoParc = (e.IdColor==9) ? e.TiempoParc : (e.IdColor==1030) ? "Iniciado" : e.TiempoFin;
                    reporte.Operarios = "";
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
                r.Data = EtapasResponse;//Agrego la lista al data del response. El response en si esta inicializado al principio del metodo.
                
                return Ok(r);//Devuelvo que salio todo josha junto con el response (r).
            }catch(Exception e){//Si pincha devuelvo mensaje de error
                r.Message = e.Message;
                r.Status = 409;
                return Conflict(r);
            }
        }
    }
}