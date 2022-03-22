import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, tap } from 'rxjs/operators';
import  {Transformadores} from '../models/transformadores';
import { Observable, of} from 'rxjs';
import { TransformadoresEtapas } from '../models/transformadoresEtapas';
import { Transform } from 'stream';
import { TipoEtapa } from '../models/tipoEtapa';
import { Etapa } from '../models/etapa';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material';
import { IResponse } from '../models/iresponse';
import { OrderTrafo } from '../models/orderTrafo';
import { MonthYear } from '../models/monthYear';
import { EnroqueTrafos } from '../models/enroqueTrafos';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = `${environment.baseUrl}/transformadores`;


@Injectable({
  providedIn: 'root'
})

export class TransformadoresService {

  apiUrl = `${environment.baseUrl}/transformadores`;

  constructor(private http: HttpClient,private _snackBar: MatSnackBar) { }

  getTransformadores(): Observable<Transformadores[]> {
    return this.http.get<Transformadores[]>(this.apiUrl)
      .pipe(
        tap(_ => this.log('fetched Transformadores')),
        catchError(this.handleError('getTransformadores', []))
      );
  }

  getTransformadoresNoProcess():Observable<Transformadores[]>{
    return this.http.get<Transformadores[]>(`${this.apiUrl}/getTransformadoresNoProcess`)
    .pipe(
      tap(_ =>this.log('fetched TransformadoresNoProcess')),
      catchError(this.handleError('getTransformadoresNoProcess',[]))
    )
  }

  getTransformador(id:number):Observable<Transformadores>{
    const url=`${apiUrl}/${id}`;
    return this.http.get<Transformadores>(url).pipe(
      tap(_ => console.log(`fetched Transformador id=${id}`)),
      catchError(this.handleError<Transformadores>(`getTransformador id=${id}`))
    )
  }

  getOrden():Observable<Transformadores[]>{
    return this.http.get<Transformadores[]>(`${this.apiUrl}/Orden`)
    .pipe(
      tap(_=>this.log('fetched Orden')),
      catchError(this.handleError('getOrden',[]))
    );
  }

  

  getDataExcel():Observable<TransformadoresEtapas[]>{
    return this.http.get<TransformadoresEtapas[]>(`${this.apiUrl}/GetDataExcel`)
      .pipe(data=>(data));
  }

  getOrderTrafo(monthYear:MonthYear[]):Observable<IResponse<OrderTrafo[]> | any>{
    return this.http.post<IResponse<OrderTrafo[]> | any>(`${this.apiUrl}/orderTrafo`,monthYear)
    .pipe(
      tap((transformadorRes) => console.log(`order trafo`)),
      catchError(this.handleError<Transformadores>('order Trafo'))
    )
  }

  getTrafosVariosProcesos():Observable<Transformadores[]>{
    return this.http.get<Transformadores[]>(`${this.apiUrl}/getTrafosVariosProcesos`)
    .pipe(
      tap(_=>this.log('fetched Orden')),
      catchError(this.handleError('getOrden',[]))
    );
  }


  addTransformador(transformador: any): Observable<Transformadores> {
    return this.http.post<Transformadores>(this.apiUrl, transformador, httpOptions).pipe(
      tap((transformadorRes: Transformadores) => console.log(`Transformador agregado con el id=${transformadorRes.idTransfo}`)),
      catchError(this.handleError<Transformadores>('addTransformador'))
    );
  }

  addTransformadores(transformador: Transformadores[]): Observable<Transformadores[]>{
    return this.http.post<Transformadores[]>(`${this.apiUrl}/PostTransformadoresArr`, transformador, httpOptions).pipe(
      tap((transformadorRes: Transformadores[]) => this.openSnackBar(`Transformadores agregados`,'Exito!')),
      catchError(this.handleError<Transformadores[]>('addTransformador'))
    );
  }

  getTipoEtapasXTransfo(id:number):Observable<any[]>{
    const url=`${apiUrl}/getEtapasVacias/${id}`;
    return this.http.get<any[]>(url).pipe(
      tap(_ => console.log(`fetched TipoEtapas`)),
      catchError(this.handleError<any[]>(`get TipoEtapas`))
    )
  }

  getEtapasPausadas(id:number):Observable<Etapa[]>{
    const url=`${apiUrl}/GetEtapasPausadas/${id}`;
    return this.http.get<Etapa[]>(url).pipe(
      tap(_ => console.log(`fetched EtapasPausadas`)),
      catchError(this.handleError<Etapa[]>(`get Etapas pausadas`))
    )
  }

  getTrafos():Observable<Transformadores[]>{
    return this.http.get<Transformadores[]>(`${this.apiUrl}/getTrafos`)
    .pipe(
      tap(_ => this.log('fetched Transformadores')),
      catchError(this.handleError('getTransformadores', []))
    );
  }

  getTrafosByPage(pageNumber:number):Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/getTrafosByPage/1`)
    .pipe(
      tap(_=>this.log('fetched Page Trafos')),
      catchError(this.handleError('get By Page',[]))
    )
  }

  getPrueba(pageNumber:number):Observable<IResponse<any[]> | any>{
    return this.http.get<IResponse<any[]>>(`${this.apiUrl}/testTrafosBackendOrdenado`)
    .pipe(
      tap(_=>this.log('fetched Page Trafos')),
      catchError(this.handleError('get By Page',[]))
    )
  }

  // GetTrafosByPageProcess(pageNumber:number):Observable<any[]>{
  //   return this.http.get<any[]>(`${this.apiUrl}/GetTrafosByPageProcess/${pageNumber}`)
  //   .pipe(
  //     tap(_=>this.log('fetched Page Trafos')),
  //     catchError(this.handleError('get By Page',[]))
  //   )
  // }

  GetTrafosByPageProcess(pageNumber:number):Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/getTrafosByPageProcessOrdenado/${pageNumber}`)
    .pipe(
      tap(_=>this.log('fetched Page Trafos')),
      catchError(this.handleError('get By Page',[]))
    )
  }
  

  // getTrafosFilter(filter:any ):Observable<any[]>{
  //   console.log(filter);
  //   return this.http.get<any[]>(`${this.apiUrl}/getFilteredValue`,{
  //     params:{
  //       oTe :filter.oTe,
  //       nucleos:filter.nucleos,
  //       oPe:filter.oPe,
  //       rangoInicio:filter.rangoInicio,
  //       potencia:filter.potencia,
  //       nombreCli:filter.nombreCli,
  //       month:filter.month,
  //       year:filter.year,
  //       observaciones:filter.observaciones,
  //       serie:filter.serie,
  //       vendedor:filter.vendedor
  //     }
  //   })
  //   .pipe(
  //     tap(_=>this.log('fetched Filter')),
  //     catchError(this.handleError('get By Filter',[]))
  //   )
  // }

  getTrafosFilter(filter:any ):Observable<any[]>{
    console.log(filter);
    return this.http.get<any[]>(`${this.apiUrl}/getFilteredValueOrdenado`,{
      params:{
        // oTe :filter.oTe,
        // nucleos:filter.nucleos,
        // oPe:filter.oPe,
        // rangoInicio:filter.rangoInicio,
        // potencia:filter.potencia,
        // nombreCli:filter.nombreCli,
        // month:filter.month,
        // year:filter.year,
        // observaciones:filter.observaciones,
        // serie:filter.serie,
        // vendedor:filter.vendedor

        oTeDesde:filter.oTeDesde,
        oTeHasta:filter.oTeHasta,
        oPeDesde:filter.oPeDesde,
        oPeHasta:filter.oPeHasta,
        rangoInicioDesde:filter.rangoInicioDesde,
        rangoInicioHasta:filter.rangoInicioHasta,
        potenciaDesde:filter.potenciaDesde,
        potenciaHasta:filter.potenciaHasta,
        nucleos:filter.nucleos,
        serieDesde:filter.serieDesde,
        serieHasta:filter.serieHasta,
        nombreCli:filter.nombreCli,
        observaciones:filter.observaciones,
        vendedor:filter.vendedor,
        tTransfo:filter.tTransfo,
        month:filter.month,
        year:filter.year
      }
    })
    .pipe(
      tap(_=>this.log('fetched Filter')),
      catchError(this.handleError('get By Filter',[]))
    )
  }

  
  // getTrafosFilterProcess(filter:any ):Observable<any[]>{
  //   console.log(filter);
    
  //   return this.http.get<any[]>(`${this.apiUrl}/GetFilteredValueProcess`,{
  //     params:{
  //         oTe :filter.oTe,
  //         oPe:filter.oPe,
  //         rangoInicio:filter.rangoInicio,
  //         potencia:filter.potencia,
  //         nProceso:filter.nProceso,
  //         month:filter.month,
  //         year:filter.year,
  //         observaciones:filter.observaciones
  //     }
  //   })
  //   .pipe(
  //     tap(_=>this.log('fetched Filter')),
  //     catchError(this.handleError('get By Filter',[]))
  //   )
  // }

  getTrafosFilterProcess(filter:any ):Observable<any[]>{
    console.log(filter);
    
    return this.http.get<any[]>(`${this.apiUrl}/GetFilteredValueProcessOrdenado`,{
      params:{
          oTe :filter.oTe,
          oPe:filter.oPe,
          rangoInicio:filter.rangoInicio,
          potencia:filter.potencia,
          nProceso:filter.nProceso,
          month:filter.month,
          year:filter.year,
          observaciones:filter.observaciones
      }
    })
    .pipe(
      tap(_=>this.log('fetched Filter')),
      catchError(this.handleError('get By Filter',[]))
    )
  }

  getRange(cantidad:number,oPe:number,rangoInicio:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getRange/${cantidad}/${oPe}/${rangoInicio}`)
    .pipe(
      tap(_ => this.log(_)),
      catchError((this.handleError('get Range', "Revise el rango por favor")))
    );
  }

  getRangeOnPut(idTransfo:number,oPe:number,rangoInicio:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getRangeOnPut/${idTransfo}/${oPe}/${rangoInicio}`)
    .pipe(
      tap(_ => this.log(_)),
      catchError((this.handleError('get Range', "Revise el rango por favor")))
    );
  }

  getMonthYear():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getMonthYear`)
    .pipe(
      tap(_=> this.log(_)),
      catchError(this.handleError('get Month Year',"error"))
    )
  }

  updateTransformador (id: number, transformador: any): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, transformador, httpOptions).pipe(
      tap(_ => this.openSnackBar(`Transformador Modificado`,"Exito")),
      catchError(this.handleError<any>('updateTranformador'))
    );
  }

  // updateAllTrafos(arrayIdTrafos,form):Observable<any>{
    updateAllTrafos(transformador):Observable<any>{
    const url = `${apiUrl}/updateAllTrafos`;
    return this.http.put(url,transformador,httpOptions).pipe(
      tap(_ => this.openSnackBar('Transformadores actualizados','Ok')),
      catchError(this.handleError<any>('updated Transformadores'))
    )
  }

  newUpdateAllTrafos(transformadores):Observable<IResponse<any>>{
    const url = `${apiUrl}/newUpdateAllTrafos`;
    return this.http.put<IResponse<any>>(url,transformadores,httpOptions).pipe(
      tap(_ => this.openSnackBar('Transformadores actualizados','Ok')),
      catchError(this.handleError<IResponse<any>>('updated Transformadores'))
    )
  }

  AsignarFechaProdMesGet(mes:number,anio:number){
    return this.http.get<IResponse<any>>(`${this.apiUrl}/AsignarFechaProdMesGet/${mes}/${anio}`)
    .pipe(
      tap(_=>this.log('fetched Page Trafos')),
      catchError(this.handleError('get By Page',[]))
    )
  }

  deleteTransformador (id: number): Observable<Transformadores> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Transformadores>(url, httpOptions).pipe(
      tap(_ => this.openSnackBar(`Transformador Borrado`,"Exito!")),
      catchError(this.handleError<Transformadores>('delete Transformadores'))
    );
  }

  deleteAllTrafos(arrayTrafos:number[]):Observable<IResponse<any> | any>{
    const url = `${apiUrl}/DeleteMasivoTrafos`
    return this.http.post<IResponse<any>>(url,arrayTrafos,httpOptions,).pipe(
      tap(_ => this.openSnackBar(`${_.message}`,"!")),
      catchError(this.handleError<IResponse<any>>('delete many Transformadores',))
    )
  }

  confirmDeleteAllTrafos(arrayTrafos:number[]):Observable<IResponse<any> | any>{
    const url = `${apiUrl}/DeleteMasivoTrafosNoCheck`
    return this.http.post<IResponse<any>>(url,arrayTrafos,httpOptions).pipe(
      tap(_ => this.openSnackBar(`${_.message}`,"Exito!")),
      catchError(this.handleError<IResponse<any>>('confirm delete many Transformadores',))
    )
  }

  postEnroqueTrafos(enroqueTrafos:EnroqueTrafos):Observable<IResponse<any> | any>{
    const url = `${apiUrl}/EnroqueTrafos`
    return this.http.post<IResponse<any>>(url,enroqueTrafos,httpOptions).pipe(
      tap(_ => this.openSnackBar(`${_.message}`,"Exito!")),
      catchError(this.handleError<IResponse<any>>('Enroque Trafos',))
    )
  }

  
  
  openSnackBar(mensaje1,mensaje2)
  {
    this._snackBar.open(mensaje1,mensaje2,{
      duration: 3000,
    })
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error:HttpErrorResponse): Observable<T> => {
      
        // TODO: send the error to remote logging infrastructure
        this.openSnackBar(`${error.error.message}`,`${error.error.status}`) // log to console instead
  
        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.error.message}`);
  
        // Let the app keep running by returning an empty result.
        return of(error.error as T);
        
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
