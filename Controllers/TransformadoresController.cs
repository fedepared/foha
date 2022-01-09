using System.Reflection.Metadata;
using System.Reflection;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Net.Http.Headers;
using System.Runtime.Versioning;
using System.Transactions;
using System.Threading.Tasks.Dataflow;
using System.Net.Sockets;
using System.IO.Compression;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Foha.Models;
using Foha.Dtos;
using Foha.Repositories;
using AutoMapper;
using System.Data.SqlClient;
using Foha.Controllers;
using Newtonsoft.Json.Linq;
using Foha.DTOs;
using System.Dynamic;

namespace Foha.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransformadoresController : ControllerBase
    {
        private readonly fohaIniContext _context;
        private readonly IMapper _mapper;
        private readonly IDataRepository<Transformadores> _repo;
        private readonly IDataRepository<Etapa> _repoEtapa;

        public TransformadoresController(fohaIniContext context, IMapper mapper, IDataRepository<Transformadores> repo, IDataRepository<Etapa> repoEtapa)
        {
            _context = context;
            _mapper = mapper;
            _repo = repo;
            _repoEtapa=repoEtapa;
        }

        // GET: api/Transformadores
        [HttpGet]
        public IEnumerable<Transformadores> GetTransformadores()
        {
            return _context.Transformadores.OrderByDescending(x=>x.Anio).ThenByDescending(z=>z.Mes).Include(x=>x.Etapa).ToList();
        }

        // GET: api/Transformadores/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransformadores([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var transformadores = await _context.Transformadores.FindAsync(id);

            if (transformadores == null)
            {
                return NotFound();
            }

            return Ok(transformadores);
        }

        [HttpGet("GetDataExcel")]
        public IEnumerable<object> GetDataExcel()
        {
            return (
                    from Z in _context.Transformadores.ToList()
                    select new
                    {
                        idTransfo = Z.IdTransfo,
                        oTe = Z.OTe,
                        oPe = Z.OPe,
                        observaciones = Z.Observaciones != null ? Z.Observaciones : " ",
                        potencia = Z.Potencia,

                        rangoInicio = Z.RangoInicio,
                        rangoFin = Z.RangoFin,
                        nombreCli = Z.NombreCli !=  null ? Z.NombreCli : " ",
                        etapaTransfo = (from n in _context.Etapa.Where(x => x.IdTransfo == Z.IdTransfo).ToList()
                                        select new {
                                            nombreEtapa = _context.TipoEtapa.Where(x => x.IdTipoEtapa == n.IdTipoEtapa).Count() > 0 ?  _context.TipoEtapa.Where(x => x.IdTipoEtapa == n.IdTipoEtapa).FirstOrDefault().NombreEtapa : "",
                                            dateIni = n.DateIni,
                                            dateFin = n.DateFin,
                                            tiempoParc = n.TiempoParc,
                                            tiempoFin=n.TiempoFin
                                        }

                         )
                     } ).ToList();
    }

    [HttpGet("Orden")]
    public IEnumerable<object> PostOrden()
    {

        // resultado de la base de datos
		var trafosOrdenados = _context.Transformadores.OrderBy(z=>z.Anio).ThenBy(x=>x.Mes).ThenBy(y=>y.Prioridad).Include(x=>x.IdClienteNavigation).ToList();

		// lista que se le devuelve al frontend
		List<List<Transformadores>> trafosSegmentados = new List<List<Transformadores>>();
		// la papa
		List<Transformadores> trafosPorMesAnio = new List<Transformadores>();
		Transformadores ultimoTrafoAgregado = null;

        foreach (Transformadores trafo in trafosOrdenados)
		{
			// si no es el primero y es de otro mes o año que el anterior entonces agrego la lista y empiezo una nueva

			if (ultimoTrafoAgregado != null && (ultimoTrafoAgregado.Anio != trafo.Anio || ultimoTrafoAgregado.Mes != trafo.Mes))
			{
				trafosSegmentados.Add(trafosPorMesAnio);
				trafosPorMesAnio = new List<Transformadores>();
			}


			trafosPorMesAnio.Add(trafo);
			ultimoTrafoAgregado = trafo;
		}
        // agregamos los ultimos que quedan colgados
		trafosSegmentados.Add(trafosPorMesAnio);

        // // mostrar por consola como uqeda
		// foreach (var sublistaTrafos in trafosSegmentados)
		// {
		// 	System.Console.WriteLine("MES: {0} - AÑO: {1}", sublistaTrafos[0].Mes, sublistaTrafos[0].Anio);
		// 	foreach (var trafo in sublistaTrafos)
		// 	{
		// 		System.Console.WriteLine("#{1} - {0} ", trafo.IdTransfo, trafo.Prioridad);
		// 	}
		// 	System.Console.WriteLine("-----------");
		// }

        return trafosSegmentados;


    }

    [HttpGet("getEtapasVacias/{id}")]

    public IEnumerable<TipoEtapa> GetEtapasVacias([FromRoute]int id){


        string cadena= " SELECT * from tipoEtapa Where idTipoEtapa IN (select idTipoEtapa from etapa where idTransfo=";
        string cadena2=$"{cadena}{id} and dateIni is null)";
        string cadena3="union select * from tipoEtapa where idTipoEtapa IN (select idTipoEtapa from Etapa where (tiempoParc is not null and tiempoParc!='Finalizada') and idTransfo=";
        string cadena4=$"{cadena2}{cadena3}{id})";


        var transfo=_context.Transformadores.Find(id);

        List<TipoEtapa> resultadoAnterior = new List<TipoEtapa>();
        var i=0;
        int[] arrayEncapsulados = {2,3,4,5,6,7,8,9,10,11,12,13,14,16,20,21,22,23,24,25,26,27,28,38,39,40,41,42,43};
        int [] arrayDistribucion = {8,9,10,11,12,13,14};
        var petroleros = 14;
        var resultado=_context.TipoEtapa.FromSql(cadena4);
        if(transfo.IdTipoTransfo==2)
        {
            resultadoAnterior=resultado.Where(z=>z.IdTipoEtapa != arrayEncapsulados[i]).ToList();
            for(i=1;i<arrayEncapsulados.Length;i++){
                resultadoAnterior=resultadoAnterior.Where(x=>x.IdTipoEtapa!=arrayEncapsulados[i]).ToList();

            };
            i=0;
        }
        if(transfo.IdTipoTransfo==3){
            resultadoAnterior=resultado.Where(z=>z.IdTipoEtapa != arrayDistribucion[i]).ToList();
            for(i=1;i<arrayDistribucion.Length;i++){
                resultadoAnterior=resultadoAnterior.Where(x=>x.IdTipoEtapa!=arrayDistribucion[i]).ToList();

            };
            i=0;
        }
        if(transfo.IdTipoTransfo==4){
            resultadoAnterior=resultado.ToList();
        }
        if(transfo.IdTipoTransfo==5){
            resultadoAnterior=resultado.Where(z=>z.IdTipoEtapa != petroleros).ToList();
        }
        if(transfo.IdTipoTransfo==6){
            resultadoAnterior=resultado.ToList();
        }


        return resultadoAnterior;

    }

    [HttpGet("getEtapasPausadas/{id}")]

    public IEnumerable<Etapa> GetEtapasPausadas([FromRoute]int id){

        string cadena="select * from Etapa where tiempoParc!='Finalizada' and dateIni is not null and idTransfo=";
        string cadena2=$"{cadena}{id}";
        // string cadena3="union select * from tipoEtapa where idTipoEtapa IN (select idTipoEtapa from Etapa where (tiempoParc!='Finalizada')  and idTransfo=";
        // string cadena4=$"{cadena2}{cadena3}{id})";

        var resultado = _context.Etapa.FromSql(cadena2);
        return resultado;

    }

    [HttpGet("getTrafos")]

    public IEnumerable<object> GetTrafos(){

      var resultado =_context.Transformadores
      .Include(z=>z.IdClienteNavigation)
      .Include(x=>x.Etapa).ThenInclude(x=>x.IdColorNavigation)
      .Include(f=>f.Etapa).ThenInclude(x=>x.EtapaEmpleado)
      .GroupBy(x=> new { x.Anio, x.Mes}, (key, group) => new
            {
                Anio = key.Anio,
                Mes = key.Mes,
                Trafos =group.OrderBy(x=>x.Prioridad).ToList()
            })
        .OrderByDescending(z=>z.Anio).ThenBy(z=>z.Mes);

      List<Object> array = new List<Object>();

      foreach (var result in resultado) {
          var mesEnLetras = this.AsignarMes(result.Mes);
          var obj = new {group = $"{mesEnLetras} de {result.Anio}. Tot:{result.Trafos.Count}"};

          array.Add(obj);
          array.AddRange(result.Trafos);
      }
    return array;

    }

    [HttpGet("getTrafosByPage/{pageNumber}")]
    public async Task<IActionResult> GetTrafosByPage([FromRoute]int pageNumber)
    {
            var pageQuantity=pageNumber * 80;
            DateTime month = DateTime.Now;
            var resultado2=_context.Transformadores
            .Include(x=>x.IdClienteNavigation)
            .Include(x=>x.IdVendedorNavigation)
            .Include(x=>x.Etapa).ThenInclude(x=>x.IdColorNavigation)
            // .Where(x=>x.Mes == month.Month && x.Anio==month.Year).ToList();
            .Where(x=>x.Mes == month.Month && x.Anio==month.Year).OrderBy(x=>x.Prioridad).ToList();

            //A preguntar, condición de filtrado de los procesos terminados (en esta línea filtra los procesos que tienen una de las últimas dos etapas finalizadas) (FUNCA)
            //resultado2 = resultado2.Where(x=> x.Etapa.Where(z => z.IdTipoEtapa == 32).First().IsEnded!=true).ToList();

            var resultado=resultado2.GroupBy(x=> new { x.Anio, x.Mes}, (key, group) => new
            {
                Anio = key.Anio,
                Mes = this.AsignarMes(key.Mes) ,
                Trafos =group.ToList().OrderBy((x=>x.Prioridad))
            });
            return Ok(resultado);


            //Para trabajarlo
            // OrderTrafoDto order = new OrderTrafoDto();
            // order.Id=this.AsignarMes(month.Month) + " de " + month.Year +". "+ "Tot: "+resultado2.Count();
            // order.Lista=resultado2;

            // return Ok(order);
    }

    [HttpGet("getTrafosByPageProcess/{pageNumber}")]
    public async Task<IActionResult> GetTrafosByPageProcess([FromRoute]int pageNumber)
    {
            var pageQuantity=pageNumber * 80;
            DateTime month = DateTime.Now;


            var resultado= _context.Transformadores
            .Include(z=>z.IdClienteNavigation)
            .Include(x=>x.Etapa).ThenInclude(x=>x.IdColorNavigation)
            .Include(f=>f.Etapa).ThenInclude(x=>x.EtapaEmpleado)
            // .Where(trafo => trafo.Etapa.All(x=>x.IsEnded!=true))
            // .OrderByDescending(g=>g.Anio).ThenBy(g=>g.Mes).Take(pageQuantity).ToList();
            .Where(x=>x.Mes == month.Month && x.Anio==month.Year).ToList();

            // OrderTrafoDto order = new OrderTrafoDto();
            // order.Id="Bla bla bla";
            // order.Anio=month.Year;
            // order.Mes=month.Month;
            // order.Lista=resultado.OrderBy(x=>x.Prioridad).ToList();

            // return Ok(order);
            var resultado2=resultado.Select(x=>new {x.Anio,x.Mes,x.Etapa,x.OTe,x.OPe,x.RangoInicio,x.Potencia,x.Prioridad,x.IdTransfo,x.Observaciones})



            .GroupBy(x=> new { x.Anio, x.Mes}, (key, group) => new
            {
                Anio = key.Anio,
                Mes = this.AsignarMes(key.Mes) ,
                Trafos =group.OrderBy(x=>x.Prioridad).ToList()
            });



            return Ok(resultado2);

    }

    [HttpGet("getFilteredValue")]
    public IActionResult GetFilteredValue(
        [FromQuery (Name = "oTe")] string oTe,
        [FromQuery (Name = "nucleos")] string nucleos,
        [FromQuery (Name = "oPe")] string oPe,
        [FromQuery (Name = "rangoInicio")] string rangoInicio,
        [FromQuery (Name = "potencia")] string potencia,
        [FromQuery (Name = "nombreCli")] string nombreCli,
        [FromQuery (Name = "month")] int[] month,
        [FromQuery (Name = "year")] int[] year,
        [FromQuery (Name = "observaciones")]string observaciones,
        [FromQuery (Name = "serie")] string serie,
        [FromQuery (Name = "vendedor")] int? vendedor
        )
    {
        List<Transformadores> trafos = new List<Transformadores>();
        var results = _context.Transformadores.Include(z=>z.IdClienteNavigation)
            .Include(z=>z.IdVendedorNavigation)
            .Include(x=>x.Etapa).ThenInclude(x=>x.IdColorNavigation)
            .Include(f=>f.Etapa).ThenInclude(x=>x.EtapaEmpleado)
            .OrderBy(g=>g.Anio).ThenBy(g=>g.Mes).ToList();

        if(oTe !=null)
            results=results.Where(x=>x.OTe != null && x.OTe.ToString().Contains(oTe)).ToList();
        if(nucleos !=null)
            results=results.Where(x=>x.Nucleos != null && x.Nucleos.Contains(nucleos.ToUpper())).ToList();
        if(oPe !=null)
            results=results.Where(x=>x.OPe.ToString().Contains(oPe)).ToList();
        if(rangoInicio !=null)
            results=results.Where(x=>x.RangoInicio.ToString().Contains(rangoInicio)).ToList();
        if(potencia !=null)
            results=results.Where(x=>x.Potencia==(Int32.Parse(potencia))).ToList();
        if(nombreCli !=null)
            results=results.Where(x=>x.NombreCli!=null && x.NombreCli.Contains(nombreCli.ToUpper())).ToList();
        if(observaciones !=null)
            results = results.Where(x=>(x.Observaciones ?? " ").ToUpper().Contains(observaciones.ToUpper())).ToList();
        if(serie !=null)
            results = results.Where(x => x.Serie.ToString().Contains(serie)).ToList();
        if(vendedor !=null)
            results = results.Where(x=>x.IdVendedor == vendedor).ToList();
        if(month.Length>0)
        {
            
            for (var i = 0; i < month.Length; i++)
            {
                trafos.AddRange(results.Where(x=>x.Mes==month[i] && x.Anio==year[i]).ToList());
            }
            
        }

               

        if(trafos.Count()>0)
        {

            var resultados=trafos.OrderBy(x=>x.Anio).ThenBy(x=>x.Mes).GroupBy(x=> new { x.Anio, x.Mes}, (key, group) => new
            {
                Anio = key.Anio,
                Mes = this.AsignarMes(key.Mes) ,
                Trafos =group.OrderBy(x=>x.Prioridad)
            });
            return Ok(resultados);
        }
        else{
            if(results.Count()>0)
            {
                var resultados=results.OrderBy(x=>x.Anio).ThenBy(x=>x.Mes).GroupBy(x=> new { x.Anio, x.Mes}, (key, group) => new
                {
                    Anio = key.Anio,
                    Mes = this.AsignarMes(key.Mes) ,
                    Trafos =group.OrderBy(x=>x.Prioridad)
                });
                return Ok(resultados);
            }
            else{
                return Ok();
            }
        }

    }

    [HttpGet("GetFilteredValueProcess")]
    public IActionResult GetFilteredValueProcess(
        [FromQuery (Name = "oTe")] string oTe,
        [FromQuery (Name = "oPe")] string oPe,
        [FromQuery (Name="rangoInicio")] string rangoInicio,
        [FromQuery (Name = "potencia")] string potencia,
        [FromQuery (Name = "month")] int[] month,
        [FromQuery (Name ="year")]int[] year,
        [FromQuery (Name = "nProceso")] string nProceso,
        [FromQuery (Name = "observaciones")]string observaciones

        )
    {
        var results = _context.Transformadores.Include(z=>z.IdClienteNavigation)
            .Include(z=>z.IdVendedorNavigation)
            .Include(x=>x.Etapa).ThenInclude(x=>x.IdColorNavigation)
            .Include(f=>f.Etapa).ThenInclude(x=>x.EtapaEmpleado)
            .OrderByDescending(g=>g.Anio).ThenBy(g=>g.Mes).ToList();
        List<Transformadores> trafo = new List<Transformadores>();





        if(oTe !=null)
            results=results.Where(x=>x.OTe != null && x.OTe.ToString().Contains(oTe)).ToList();
        if(oPe !=null)
            results=results.Where(x=>x.OPe.ToString().Contains(oPe)).ToList();
        if(rangoInicio !=null)
            results=results.Where(x=>x.RangoInicio.ToString().Contains(rangoInicio)).ToList();
        if(potencia !=null)
            results=results.Where(x=>x.Potencia==(Int32.Parse(potencia))).ToList();
        if(nProceso != null)
            results=results.Where(x=>x.Etapa.Any(f=>f.NumEtapa != null && f.NumEtapa.ToString().Contains(nProceso))).ToList();
        if(observaciones !=null)
            results = results.Where(x=>(x.Observaciones ?? " ").ToUpper().Contains(observaciones.ToUpper())).ToList();
        if(month.Length>0)
        {
            for (var i = 0; i < month.Length; i++)
            {
                trafo.AddRange(results.Where(x=>x.Mes==month[i] && x.Anio==year[i]).ToList());
            }

        }

        results.Select(x=>new {x.Anio,x.Mes,x.Etapa,x.OTe,x.OPe,x.RangoInicio,x.Potencia,x.Prioridad,x.IdTransfo,x.Observaciones});

        if(trafo.Count()>0)
        {

            var resultados=trafo.OrderBy(x=>x.Anio).ThenBy(x=>x.Mes).GroupBy(x=> new { x.Anio, x.Mes}, (key, group) => new
            {
                Anio = key.Anio,
                Mes = this.AsignarMes(key.Mes) ,
                Trafos =group.OrderBy(x=>x.Prioridad)
            });
            return Ok(resultados);
        }
        else{
            if(results.Count()>0)
            {
                var resultados=results.OrderBy(x=>x.Anio).ThenBy(x=>x.Mes).GroupBy(x=> new { x.Anio, x.Mes}, (key, group) => new
                {
                    Anio = key.Anio,
                    Mes = this.AsignarMes(key.Mes) ,
                    Trafos =group.OrderBy(x=>x.Prioridad)
                });
                return Ok(resultados);
            }
            else{
                return Ok();
            }
        }

    }

    [HttpGet("trafosByValues/{oPe}/{oTe}/{potencia}")]

    public async Task<IActionResult> getTransformadoresByValues([FromRoute] int oPe,[FromRoute]  int oTe,[FromRoute] int potencia)
    {
        return Ok(await _context.Transformadores.Where(x=>x.Potencia == potencia && x.OPe== oPe && x.OTe == oTe).ToArrayAsync());
    }

    [HttpGet("getRange/{cantidad}/{oPe}/{rangoInicio}")]
    public async Task<IActionResult> getRange([FromRoute] int cantidad,[FromRoute] int oPe, [FromRoute] int rangoInicio)
    {
        List<int> lista = new List<int>();
        for (var i = 0; i < cantidad; i++)
        {
            var transfo=await _context.Transformadores.Where(x=>x.OPe==oPe && x.RangoInicio==rangoInicio+i).FirstOrDefaultAsync();
            if(transfo != null)
            {
                lista.Add(transfo.RangoInicio);
            }
        }
        if(lista.Count()>0)
        {
            return BadRequest($"Ya existen transformadores creados desde rango {lista.First()} hasta {lista.Last()}");
        }
        else{
            return Ok();
        }

    }

    [HttpGet("getRangeOnPut/{idTransfo}/{oPe}/{rangoInicio}")]
    public async Task<IActionResult> getRangeOnPut([FromRoute] int idTransfo,[FromRoute] int oPe, [FromRoute] int rangoInicio)
    {
        var transfo =await _context.Transformadores.Where(x=>x.OPe == oPe && x.RangoInicio == rangoInicio).ToListAsync();

        if(transfo.Any(x=>x.IdTransfo!=idTransfo))
        {
            return BadRequest($"Ya existen transformadores creados con el rango {rangoInicio}");
        }
        else{
            return Ok();
        }
    }

    [HttpGet("getMonthYear")]
    public async Task<IActionResult> getMonthYear()
    {
        Response<dynamic> res = new Response<dynamic>();
        try{
            var mY = _context.Transformadores.Where(x => x.Etapa.Any(z => z.IsEnded == null || z.IsEnded == false))
                .Include(x => x.Etapa)
                .OrderByDescending(x=>x.Anio).ThenByDescending(x=>x.Mes).ToList()
                .GroupBy(x=> new { x.Anio, x.Mes}, (key, group) => new{
                    Anio=key.Anio,
                    Mes = this.AsignarMes(key.Mes),
                    idMes = key.Mes,
                    Count=group.Count()
                });
            res.Message = "Se realizo la consulta satisfactoriamente";
            res.Data = mY;
            res.Status = 200;
            return Ok(mY);
        }catch(Exception e){
            res.Message = "Se realizo la consulta satisfactoriamente";
            res.Status = 400;
            return Conflict(e.Message);
        }
    }

    [HttpPost("orderTrafo")]
    public async Task<IActionResult> GetOrderTrafo([FromBody] MonthYearDto[] monthYear)
    {
        List<OrderTrafoDto> orderTrafo = new List<OrderTrafoDto>();
        Response<List<OrderTrafoDto>> r = new Response<List<OrderTrafoDto>>();
        r.Message="Ok";
        r.Status=200;
        try
        {
            foreach (var mY in monthYear)
            {
                OrderTrafoDto addOrder=new OrderTrafoDto();
                var trafos=await _context.Transformadores.Where(x=>x.Anio==mY.Year && x.Mes==mY.Month).OrderBy(x=>x.Prioridad).ToListAsync();
                addOrder.Anio = mY.Year;
                addOrder.Mes = mY.Month;
                addOrder.Id = "Año:"+mY.Year+" "+"Mes:"+(mY.Month);
                addOrder.Lista=trafos;
                orderTrafo.Add(addOrder);
            }
            r.Data=orderTrafo;
            return Ok(r);

        }
        catch (System.Exception ex)
        {
             r.Message = ex.Message;
             r.Status=400;
             return BadRequest(r);
        }


    }

    // POST: api/Transformadores
    [HttpPost]
    public async Task<IActionResult> PostTransformadores([FromBody] AddTransformadoresDto addTransformadoresDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }


        if(_context.Transformadores.Any(x=>addTransformadoresDto.Mes == x.Mes && addTransformadoresDto.Anio==x.Anio)){
            addTransformadoresDto.Prioridad = _context.Transformadores.Where(x=>x.Mes == addTransformadoresDto.Mes && x.Anio==addTransformadoresDto.Anio).Max(z=>z.Prioridad)+1;
        }

        //addTransformadoresDto.Prioridad=_context.Transformadores.Max(x=>x.Prioridad).Where(x=>x.mes == addTransformadoresDto.mes && x.anio==addTransformadoresDto.anio)+1;
        if(addTransformadoresDto.IdTipoTransfo == 6){
            addTransformadoresDto.RangoFin=1;
            addTransformadoresDto.RangoInicio=1;
            if(addTransformadoresDto.OPe == null){
                addTransformadoresDto.OPe = 0;
            }
        }
        else if(_context.Transformadores.Where((x=>x.OPe==addTransformadoresDto.OPe)).Count()>0){
            if(addTransformadoresDto.RangoInicio==null)
            {
                if(_context.Transformadores.Any(x=>x.OPe==addTransformadoresDto.OPe))
                {
                    var transfoIni = _context.Transformadores.Where((x=>x.OPe==addTransformadoresDto.OPe)).ToList().Max(x=>x.RangoInicio);
                    addTransformadoresDto.RangoInicio=(transfoIni)+1;
                    var listIguales=_context.Transformadores.Where((x=>x.OPe==addTransformadoresDto.OPe)).ToList();
                    foreach(var i in listIguales){
                        i.RangoFin=addTransformadoresDto.RangoInicio ?? default(int);

                    }
                    addTransformadoresDto.RangoFin=transfoIni+1;
                }
                else{

                    addTransformadoresDto.RangoFin=1;
                    addTransformadoresDto.RangoInicio=1;
                }
            }
            else{
                if(_context.Transformadores.Any((x=>x.OPe==addTransformadoresDto.OPe && x.RangoInicio==addTransformadoresDto.RangoInicio)))
                {
                    return StatusCode(412,$"Ya existe un Transformador con el Rango {addTransformadoresDto.RangoInicio}");
                    // var trafos=_context.Transformadores.Where((x=>x.OPe==addTransformadoresDto.OPe&&x.RangoInicio==addTransformadoresDto.RangoInicio)).ToList().Max(x=>x.RangoInicio);
                    // addTransformadoresDto.RangoInicio=(trafos)+1;
                }
                else{
                    // var trafos=_context.Transformadores.Where((x=>x.OPe==addTransformadoresDto.OPe)).ToList().Max(x=>x.RangoInicio);
                    var listOfTrafos=_context.Transformadores.Where((x=>x.OPe==addTransformadoresDto.OPe)).ToList();
                    foreach(var i in listOfTrafos){
                        i.RangoFin=addTransformadoresDto.RangoInicio?? default(int);
                    }
                    addTransformadoresDto.RangoFin=addTransformadoresDto.RangoInicio?? default(int);

                }
            }
        }
        else{
            if(addTransformadoresDto.RangoInicio!=null)
            {
                addTransformadoresDto.RangoFin=addTransformadoresDto.RangoInicio;
            }
            else{
                addTransformadoresDto.RangoFin=1;
                addTransformadoresDto.RangoInicio=1;
            }
        }



        var preTransformadores = _mapper.Map<Transformadores>(addTransformadoresDto);
        _repo.Add(preTransformadores);
        var saveTransformadores = await _repo.SaveAsync(preTransformadores);
        var TransformadoresResponse = _mapper.Map<TransformadoresResponseDto>(saveTransformadores);

        List<AddEtapaDto> todasLasEtapas = new List<AddEtapaDto>();
        var tipoEtapa=_context.TipoEtapa.ToList();
        foreach (var i in tipoEtapa)
        {
            if (_context.Etapa.Where(x => x.IdTransfo == TransformadoresResponse.IdTransfo && x.IdTipoEtapa == i.IdTipoEtapa).Count() == 0)
            {
                var etapa = new AddEtapaDto();
                etapa.IdTipoEtapa = i.IdTipoEtapa;
                etapa.IdTransfo = TransformadoresResponse.IdTransfo;

                int[] array=new int[5]{1,2,4,6,7};

                Array.Exists(array,x=> x==4);

                if(TransformadoresResponse.IdTipoTransfo !=4)
                {
                    switch(TransformadoresResponse.IdTipoTransfo)
                    {
                        case 2: //Agregue de la 33 a la 37 que tampoco corresponden para este trafo
                            if(i.IdTipoEtapa!=1 && i.IdTipoEtapa!=15 && i.IdTipoEtapa!=17 && i.IdTipoEtapa!=18 && i.IdTipoEtapa!=19 && i.IdTipoEtapa!=29 && i.IdTipoEtapa!=30 && i.IdTipoEtapa!=31 && i.IdTipoEtapa!=32 && i.IdTipoEtapa!=33 && i.IdTipoEtapa!=34 && i.IdTipoEtapa!=35 && i.IdTipoEtapa!=36 && i.IdTipoEtapa!=37 )
                            {
                                etapa.IdColor=1034;
                                etapa.IsEnded = true;
                            }
                            break;
                        case 3:
                            if((i.IdTipoEtapa>=8) && (i.IdTipoEtapa<=14))
                            {
                                etapa.IdColor=1034;
                                etapa.IsEnded = true;
                            }
                            break;
                        case 5:
                            if(i.IdTipoEtapa==14)
                            {
                                etapa.IdColor=1034;
                                etapa.IsEnded = true;
                            }
                            break;
                        case 6:
                            etapa.IdColor=1034;
                            etapa.IsEnded = true;
                            break;
                    }
                }


                todasLasEtapas.Add(etapa);
            }
        }

        foreach(var etapa in todasLasEtapas)
        {
            var preEtapa = _mapper.Map<Etapa>(etapa);
            _repoEtapa.Add(preEtapa);
            // var saveEtapa = await _repoEtapa.SaveAsync(preEtapa);
            // var etapaResponse = _mapper.Map<EtapaResponseDto>(saveEtapa);

        }

        try
        {
            await _context.SaveChangesAsync();
            return Ok();
        }
        catch (Exception ex)
        {
             return BadRequest(ex);
        }

    }

    [HttpPost("PostTransformadoresArr")]

    public async Task<IActionResult> PostTransformadoresArr([FromBody] AddTransformadoresDto[] addTransformadoresDto){

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if(addTransformadoresDto[0].RangoInicio==null)
        {
            foreach(var i in addTransformadoresDto){

                    await PostTransformadores(i);
            }
        }
        else{
            for(var i=0;i<addTransformadoresDto.Length;i++)
            {
                addTransformadoresDto[i].RangoInicio=addTransformadoresDto[i].RangoInicio + i;
                await PostTransformadores(addTransformadoresDto[i]);
            }
            // foreach (var item in addTransformadoresDto)
            // {
                
            // }
        }

        return Ok();


    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutTransformadores([FromRoute] int id, [FromBody] EditTransformadoresDto editTransformadoresDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        //Transformadores trafoOriginal = _context.Transformadores.AsNoTracking().FirstOrDefault(x => x.IdTransfo == editTransformadoresDto.IdTransfo);
        var preTransformadores = _mapper.Map<Transformadores>(editTransformadoresDto);
        // if(trafoOriginal.FechaProd != editTransformadoresDto.FechaProd){
        //     preTransformadores.Prioridad = _context.Transformadores.Where(x=>x.Mes == editTransformadoresDto.Mes && x.Anio== editTransformadoresDto.Anio).Max(z=>z.Prioridad) + 1;
        // }
        
        try{
            _repo.Update(preTransformadores);
            return StatusCode(201,await _repo.SaveAsync(preTransformadores));
        }catch(Exception e){
            return Conflict(e.Message);
        }

    }

    [HttpPut("updateAll")]
    public async Task<IActionResult> PutAllTrafos([FromBody] EditTransformadoresDto editTransformadoresDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var trafos= _context.Transformadores.Where(x=>x.Lote == editTransformadoresDto.Lote && x.OPe == editTransformadoresDto.OPe && x.OTe == editTransformadoresDto.OTe).ToList();

        foreach (var trafo in trafos)
        {

        }

        var preTransformadores = _mapper.Map<Transformadores>(editTransformadoresDto);
        _repo.Update(preTransformadores);
        return StatusCode(201,await _repo.SaveAsync(preTransformadores));




    }

    [HttpPut("updateAllTrafos")]
    public async Task<IActionResult> UpdateAllTransfo([FromBody] EditTransformadoresDto[] trafos)
    {
        //int prioSumada = 1;
        List<Transformadores> listaTrafos = new List<Transformadores>();
        foreach(var trafo in trafos)
        {
            //Transformadores trafoOriginal = _context.Transformadores.Where(x => x.IdTransfo == trafo.IdTransfo).AsNoTracking().FirstOrDefault();
            var preTransformadores = _mapper.Map<Transformadores>(trafo);
            // if(trafoOriginal.FechaProd != trafo.FechaProd){
            //     preTransformadores.Prioridad = _context.Transformadores.Where(x=>x.Mes == trafo.Mes && x.Anio== trafo.Anio).Max(z=>z.Prioridad) + prioSumada;
            //     prioSumada ++;
            // }
            listaTrafos.Add(preTransformadores);
        }

        try{
            _repo.UpdateAll(listaTrafos);
            await _context.SaveChangesAsync();
            return Ok("Transformadores agregados");
        }
        catch(DbUpdateException){
            throw;
        }

    }



    // DELETE: api/Transformadores/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransformadores([FromRoute] int id)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var transformadores = await _context.Transformadores.FindAsync(id);
        if (transformadores == null)
        {
            return NotFound();
        }

        //Si hay transformadores de rango mayor
        // if(_context.Transformadores.Where((x=>x.OPe==transformadores.OPe && x.RangoInicio>transformadores.RangoInicio)).Count()>0){
        //     var lista = _context.Transformadores.Where((x=>x.OPe==transformadores.OPe && x.RangoInicio>transformadores.RangoInicio)).OrderBy(x=>x.RangoInicio).ToList();

        //     foreach(var l in lista){
        //         if(l.RangoInicio>transformadores.RangoInicio){
        //             l.RangoInicio-=1;
        //         }
        //         l.RangoFin=_context.Transformadores.Where((x=>x.OPe==transformadores.OPe)).Count()-1;
        //     }
        // }

        var listaEtapa = _context.Etapa.Where(x=>x.IdTransfo==id).ToList();
        try{
            foreach(Etapa e in listaEtapa)
            {
                if(e.DateIni != null)//Si tiene DateIni busco en la tabla EtapaEmpleado el registro y lo borro.
                {
                    var etapaEmp = _context.EtapaEmpleado.Where(x => x.IdEtapa == e.IdEtapa);
                    if(etapaEmp!=null)
                    {
                        _context.RemoveRange(etapaEmp);
                    }
                }
                _context.Remove(e);//Despues de chequear y borrar de ser necesario el registro en la trabla intermedia, borro la etapa en si.
            }
            _context.Remove(transformadores);//Despues de borrar las etapas y EtapaEmpleado si habia, borro el trafo.

            await _context.SaveChangesAsync();//Guardo todo.
            return Ok("Se borraron los transformadores exitosamente.");
        }
        catch(Exception e){//Si pincha devuelvo mensaje de error

            return Conflict(e.Message);
        }
    }

    [HttpPost("DeleteMasivoTrafos")]
    public async Task<IActionResult> DeleteMasivoTrafos([FromBody] int[] trafosParaBorrar){

        var trafos = await _context.Transformadores.Where(x => trafosParaBorrar.Contains(x.IdTransfo)).ToArrayAsync();
        Response<int[]> r = new Response<int[]>();
        r.Message = "";
        r.Data = trafosParaBorrar;
        r.Status = 200;
        //Chequeo si tienen etapas iniciadas.
        foreach(Transformadores t in trafos)
        {
            bool trafoEmpezado = false;
            var etapas = await _context.Etapa.Where(x => x.IdTransfo == t.IdTransfo).ToArrayAsync();
            foreach(Etapa e in etapas)
            {
                if(e.DateIni != null)
                {
                    trafoEmpezado = true;
                }
            }
            //Si tiene alguna etapa iniciada agrego los datos al string para devolver
            if(trafoEmpezado)
            {
                if(r.Message == "")
                {
                    r.Message = "Los siguientes tranformadores tienen etapas empezadas:"+ "\n OP:" + t.OPe + ", OT:" + t.OTe + ", rango:" + t.RangoInicio;
                }
                else
                {
                    r.Message = r.Message + " - " + t.OPe + "/" + t.OTe + "/" + t.RangoInicio;
                }
                r.Status = 409;
            }
        }
        //Si el status quedo en 200 significa que no hay ningun trafo con etapas iniciadas, asique borro todo a la goma.
        if(r.Status == 200)
        {
            try{
                //Por cada trafo busco las etapas y las borro, y despues borro el trafo en si. Cuando termina devuelvo mensaje que salio todo josha.
                foreach(Transformadores t in trafos)
                {
                    var etapas = await _context.Etapa.Where(x => x.IdTransfo == t.IdTransfo).ToListAsync();
                    _context.Etapa.RemoveRange(etapas);
                    _context.Transformadores.Remove(t);
                }
                await _context.SaveChangesAsync();//Guardo todo
                r.Message = "Se borraron los transformadores exitosamente.";
                return Ok(r);
            }
            //Si pincha devuelvo mensaje de error.
            catch(Exception e){
                r.Message = e.Message;
                r.Status = 409;
                return Conflict(r);
            }
        }
        return Conflict(r);
    }

    [HttpPost("DeleteMasivoTrafosNoCheck")]
    public async Task<IActionResult> DeleteMasivoTrafosNoCheck([FromBody] int[] trafosParaBorrar){

        var trafos = await _context.Transformadores.Where(x => trafosParaBorrar.Contains(x.IdTransfo)).ToArrayAsync();
        Response<int[]> r = new Response<int[]>();
        r.Message = "";
        r.Data = trafosParaBorrar;
        r.Status = 200;
        //Borro trafos, etapas y si estan iniciadas tambien borro los datos de Etapa-Empleado.
        try{
            foreach(Transformadores t in trafos)
            {
                var etapas = await _context.Etapa.Where(x => x.IdTransfo == t.IdTransfo).ToArrayAsync();
                foreach(Etapa e in etapas)
                {
                    List<EtapaEmpleado> etapaEmp = await _context.EtapaEmpleado.Where(x => x.IdEtapa == e.IdEtapa).ToListAsync();
                    if(etapaEmp.Count() > 0)
                    {
                        _context.RemoveRange(etapaEmp);
                    }
                    _context.Remove(e);//Despues de chequear y borrar de ser necesario el registro en la trabla intermedia, borro la etapa en si.
                }
                _context.Remove(t);//Despues de borrar las etapas y EtapaEmpleado si habia, borro el trafo.
            }
            await _context.SaveChangesAsync();//Guardo todo.
            r.Message = "Se borraron los transformadores exitosamente.";
            return Ok(r);
        }
        catch(Exception e){//Si pincha devuelvo mensaje de error
            r.Message = e.Message;
            r.Status = 409;
            return Conflict(r);
        }
    }

    private bool TransformadoresExists(int id)
    {
        return _context.Transformadores.Any(e => e.IdTransfo == id);
    }

    

    private string AsignarMes(int? mes){
        switch(mes)
        {
            case 1:
                return "Enero";
            case 2:
                return "Febrero";
            case 3:
                return "Marzo";
            case 4:
                return "Abril";
            case 5:
                return "Mayo";
            case 6:
                return "Junio";
            case 7:
                return "Julio";
            case 8:
                return "Agosto";
            case 9:
                return "Septiembre";
            case 10:
                return "Octubre";
            case 11:
                return "Noviembre";
            case 12:
                return "Diciembre";
            case 13:
                return "Stock";
            case 14:
                return "Entrega pendiente";
            default:
                return "";
        }
    }

    [HttpGet("testTrafosBackend")]
    public async Task<IActionResult> TestTrafosBackend(){
        Response<List<dynamic>> r = new Response<List<dynamic>>();
        List<Transformadores> tfdto = new List<Transformadores>();
        var month=DateTime.Today.Month;
        var year=DateTime.Today.Year;
        tfdto = await _context.Transformadores.Where(x => x.Mes == month && x.Anio == year)
        .Include(x=>x.IdClienteNavigation)
        .Include(x=>x.IdVendedorNavigation)
        .Include(x=>x.Etapa).ThenInclude(x=>x.IdColorNavigation)
        .OrderBy(x=>x.Prioridad)
        .ToListAsync();


        List<dynamic> trafosDynamic = new List<dynamic>();
        var testobj = new {group = this.AsignarMes(month)+ " de "+ year+ " Tot: "+tfdto.Count() };
        trafosDynamic.Add(testobj);
        foreach(Transformadores t in tfdto){
            trafosDynamic.Add(t);
        }
        r.Message = "Se realizo la consulta exitosamente";
        r.Data = trafosDynamic;
        r.Status = 200;
        return Ok(r);
    }


    [HttpGet("testTrafosBackendOrdenado")]
    public async Task<IActionResult> TestTrafosBackendOrdenado(){
        Response<List<dynamic>> r = new Response<List<dynamic>>();
        List<Transformadores> tfdto = new List<Transformadores>();
        var month=DateTime.Today.Month;
        var year=DateTime.Today.Year;
        tfdto = await _context.Transformadores.Where(x => x.Mes == month && x.Anio == year)
        .Include(x=>x.IdClienteNavigation)
        .Include(x=>x.IdVendedorNavigation)
        .Include(x=>x.Etapa).ThenInclude(x=>x.IdColorNavigation)
        .Include(x => x.Etapa).ThenInclude(x => x.IdTipoEtapaNavigation)
        .OrderBy(x=>x.Prioridad)
        .ToListAsync();

        foreach(Transformadores t in tfdto)
        {
            t.Etapa = t.Etapa.OrderBy(x => x.IdTipoEtapaNavigation.Orden).ToList();
        }


        List<dynamic> trafosDynamic = new List<dynamic>();
        var testobj = new {group = this.AsignarMes(month)+ " de "+ year+ " Tot: "+tfdto.Count() };
        trafosDynamic.Add(testobj);
        foreach(Transformadores t in tfdto){
            trafosDynamic.Add(t);
        }
        r.Message = "Se realizo la consulta exitosamente";
        r.Data = trafosDynamic;
        r.Status = 200;
        return Ok(r);
    }

}
}