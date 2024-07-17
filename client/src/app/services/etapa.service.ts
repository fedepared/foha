import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, tap, map } from "rxjs/operators";
import { Etapa } from "../models/etapa";
import { Observable, of, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { MatSnackBar } from "@angular/material";
import { Transformadores } from "../models/transformadores";
import { EtapaPorSector } from "../models/etapaPorSector";
import { Reporte } from "../models/reporte";
import { IResponse } from "../models/iresponse";
import { runInThisContext } from "vm";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

const apiUrl = `${environment.baseUrl}/Etapa`;

@Injectable({
  providedIn: "root"
})
export class EtapaService {
  apiUrl = `${environment.baseUrl}/Etapa`;
  

  constructor(private http: HttpClient,private _snackBar:MatSnackBar) {}

  getEtapas(): Observable<Etapa[]> {
    return this.http.get<Etapa[]>(this.apiUrl).pipe(
      tap(_ => this.log("fetched Etapa")),
      catchError(this.handleError("getEtapas", []))
    );
  }

  getEtapasPorIdTransfo(id:number): Observable<Etapa[]> {
    const url = `${apiUrl}/${id}/resultadoTransfo`; 
    return this.http.get<Etapa[]>(url).pipe(
      tap(_ => this.log("fetched Etapa")),
      catchError(this.handleError("getEtapas", []))
    );
  }

  getEtapa(id: number): Observable<Etapa> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Etapa>(url).pipe(
      tap(_ => console.log(`fetched Etapa id=${id}`)),
      catchError(this.handleError<Etapa>(`getEtapa id=${id}`))
    );
  }

  getColumns(id:number):Observable<any>{
    const url = `${apiUrl}/getColumns/${id}`;
    return this.http.get<Etapa>(url).pipe(
      tap(_ => console.log(`fetched Columns para sector=${id}`)),
      catchError(this.handleError<Etapa>(`getColumns para sector=${id}`))
    )
  }

  getByIdTrafoIdTipoEtapa(idTrafo:number,idTipoEtapa):Observable<Transformadores>{
    const url = `${apiUrl}/getByIdTrafoIdTipoEtapa/${idTrafo}/${idTipoEtapa}`;
    return this.http.get<Transformadores>(url).pipe(
      tap(_=> console.log(`fetched Trafo by IdTrafo`)),
      catchError(this.handleError<Transformadores>(`getTrafo`))
    )
  }

  getEtapasTrafoIndividual(idTransfo:number):Observable<IResponse<any[]>>{
    const url = `${apiUrl}/GetEtapasTrafoIndividual/${idTransfo}`;
    return this.http.get<IResponse<any[]>>(url)
    .pipe(
      tap(_=>console.log('fetched Etapas')),
      catchError(this.handleError<IResponse<any[]>>('get Etapas por trafo'))
    )
  }

  getChequearHorno():Observable<IResponse<any[]>>{
    const url = `${apiUrl}/ChequearHorno`;
    return this.http.get<IResponse<any[]>>(url)
    .pipe(
      tap(_=>console.log('fetched Etapas')),
      catchError(this.handleError<IResponse<any[]>>('Chequeo de horno'))
    )
  }

  getPausarIniciadasViejas(){
    const url = `${apiUrl}/PausarIniciadasViejas`;
    return this.http.get<IResponse<any[]>>(url)
    .pipe(
      tap(_=>console.log('fetched iniciadas Viejas')),
      catchError(this.handleError<IResponse<any[]>>('Chequeo de horno'))
    )
  }


  addEtapa(etapa: any): Observable<Etapa> {
    return this.http
      .post<Etapa>(this.apiUrl, etapa, httpOptions)
      .pipe(
        tap((etapaRes: any) =>
          console.log(
            `Etapa agregado ${etapaRes.idEtapa}`
          )
        ),
        catchError(this.handleError<Etapa>("addEtapa"))
      );
  }

  updateEtapa(id: number, etapa: Etapa): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, etapa, httpOptions).pipe(
      tap(_ => console.log(`updated etapa id=${id}`)),
      catchError(this.handleError<any>("updateEtapa"))
    );
  }

  getEtapaByIdTransfo(idTransfo:number,sector:number):Observable<any[]>{
    const url = `${apiUrl}/${idTransfo}/${sector}/byIdTransfo`;
    return this.http.get<any>(url).pipe(
      tap(_ => console.log(`fetched Etapas by IdTransfo=${idTransfo}`)),
      catchError(this.handleError<Etapa>(`getEtapas para IdTransfo=${idTransfo}`))
    )
  }

  modifyProcesses(editAllTrafoEtapa):Observable<any>{
    const url = `${apiUrl}/modifyProcesses`;
    return this.http.put(url,editAllTrafoEtapa,httpOptions).pipe(
      tap(_=> this.openSnackBar('etapas actualizadas','Ok')),
      catchError(this.handleError<any>("Error al actualizar etapas"))
    );
  }

  patchEtapa(etapa: any[]): Observable<any> {
    const url = `${apiUrl}/switchEtapas`;
    return this.http.put(url, etapa, httpOptions).pipe(
      tap(_ => console.log(`updated etapas`)),
      catchError(this.handleError<any>("Error actualizando Etapa"))
    );
  }

  updateEtapaTimer(id:number,etapa:Etapa):Observable<any>{
    const url = `${apiUrl}/${id}/timer`;
    return this.http.put(url,etapa,httpOptions).pipe(
      tap(_ =>console.log(`updated etapa id=${id}`)),
      catchError(this.handleError<any>("updateEtapa"))
    )
  }

  

  getEtapaByProcNum(oldNum):Observable<any>{
    const url=`${apiUrl}/etapaNumProc/${oldNum}`;
    return this.http.get<any>(url).pipe(
      tap(_ => console.log('fetched Etapa by oldNum')),
      catchError(this.handleError<Etapa>('get Etapa by oldNum'))
    )
  }

  updateProcNum(idEtapa,newNum):Observable<any>{
    const url=`${apiUrl}/patchProcNum/${idEtapa}`;
    return this.http.patch(url,newNum).pipe(
      tap(_ => this.openSnackBar(`${_}`,'Exito!')),
      catchError(this.handleError<any>('update NumEtapa'))
    )
  }

  updateEtapaInicio(id:number,etapa:Etapa):Observable<any>{
    const url = `${apiUrl}/${id}/start`;
    return this.http.put(url,etapa,httpOptions).pipe(
      tap(_ =>console.log(`updated etapa id=${id}`)),
      // catchError(this.handleError<any>("updateEtapa"))
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);

        //Handle the error here

        return throwError(err);    //Rethrow it back to component
      })
    )
  }

  updateEtapaPausa(id:number,etapa:Etapa):Observable<any>{
    const url = `${apiUrl}/${id}/pause`;
    return this.http.put(url,etapa,httpOptions).pipe(
      tap(_ =>console.log(`updated etapa id=${id}`)),
      catchError(this.handleError<any>("updateEtapa"))
    )
  }

  updateEtapaStop(id:number,etapa:Etapa):Observable<IResponse<any>>{
    const url = `${apiUrl}/${id}/stop`;
    return this.http.put(url,etapa,httpOptions).pipe(
      tap(_ =>console.log(`updated etapa id=${id}`)),
      catchError(this.handleError<any>("updateEtapa"))
    )
  }

  stopEtapaEspecial(id:number,etapa:Etapa):Observable<any>{
    const url = `${apiUrl}/${id}/stopEtapaEspecial`;
    return this.http.put(url,etapa,httpOptions).pipe(
      tap(_ =>console.log(`updated etapa id=${id}`)),
      catchError(this.handleError<any>("updateEtapa"))
    )
  }

  //MultiProcesos
  updateEtapaPausaMulti(id:number,etapa:Etapa,length:number):Observable<any>{
    const url = `${apiUrl}/pause/${id}/${length}`;
    return this.http.put(url,etapa,httpOptions).pipe(
      tap(_ =>console.log(`updated etapa id=${id}`)),
      catchError(this.handleError<any>("updateEtapa"))
    )
  }

  updateEtapaStopMulti(id:number,etapa:Etapa,length:number):Observable<any>{
    const url = `${apiUrl}/stop/${id}/${length}`;
    return this.http.put(url,etapa,httpOptions).pipe(
      tap(_ =>console.log(`updated etapa id=${id}`)),
      catchError(this.handleError<any>("updateEtapa"))
    )
  }

  updateReanudarEtapa(id:number,etapa:Etapa):Observable<any>{
    const url = `${apiUrl}/${id}/reanudarFinalizado`;
    return this.http.put(url,etapa,httpOptions).pipe(
      tap(_=>console.log(`etapa con id =${id} reanudada`)),
      catchError(this.handleError<any>("reanudar Etapa"))
    )
  }

  switchArrTrafos(trafoNuevo:Array<number>,trafoViejo:Array<number>,etapas:Array<number>):Observable<any>{
    const url = `${apiUrl}/switchArrTrafos`;
    let array = 
    {
      trafoNuevoArr:trafoNuevo,
      trafoViejoArr:trafoViejo,
      etapasArr:etapas
    }
  
    return this.http.put(url,array,httpOptions).pipe(
      tap(_=>console.log(`Procesos modificados`)),
      catchError(this.handleError<any>("reanudar Etapa"))
    )
  }

  updateEtapaSola(id: number,idTransfo:number): Observable<any> {
    const url = `${apiUrl}/${id}/etapaSola`;
    return this.http.put(url, idTransfo,httpOptions).pipe(
      tap(_ => console.log(`updated etapa id=${id}`)),
      catchError(this.handleError<any>("updateEtapa"))
    );
  }

  getEtapasFinalizadas(): Observable<Etapa[]> {
    const url=`${apiUrl}/etapasFinalizadas/`
    return this.http.get<Etapa[]>(url).pipe(
      tap(_ => this.log("fetched Etapa")),
      catchError(this.handleError("getEtapas", []))
    );
  }

  postEtapasFinalizadas(etapaPorSector:EtapaPorSector):Observable<IResponse<Reporte[]>|any>{
    const url=`${apiUrl}/etapasPorSector`
    return this.http.post(url,etapaPorSector)
    .pipe(
      tap(_=>this.log('fetched postEtapasFinalizadas')),
      catchError(this.handleError("Post Etapas Finalizadas",[]))
    )
  }

  deleteEtapa(id: number): Observable<Etapa> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Etapa>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted Etapa id=${id}`)),
      catchError(this.handleError<Etapa>("delete Etapa"))
    );
  }

  openSnackBar(mensaje1,mensaje2){
    this._snackBar.open(mensaje1,mensaje2,{
      duration:2000,
    })
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.log(error);
      // TODO: send the error to remote logging infrastructure
      this.openSnackBar(`${error.error.message}`,`${error.status}`) // log to console instead

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
