import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap } from 'rxjs/operators';
import  {Transformadores} from '../models/transformadores';
import { Observable, of} from 'rxjs';
import { TipoEtapa } from '../models/tipoEtapa';
import { environment } from 'src/environments/environment';
import { IResponse } from '../models/iresponse';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const apiUrl = `${environment.baseUrl}/tipoEtapa`;

@Injectable({
  providedIn: 'root'
})
export class TipoEtapaService {
  apiUrl = `${environment.baseUrl}/tipoEtapa`;
  constructor(private http: HttpClient) { }

  getTipoEtapas(): Observable<TipoEtapa[]> {
    return this.http.get<TipoEtapa[]>(this.apiUrl)
      .pipe(
        tap(_ => this.log('fetched tipoEtapa')),
        catchError(this.handleError('getTipoEtapa', []))
      );
  }

  getTipoEtapa(id:number):Observable<TipoEtapa>{
    const url=`${apiUrl}/${id}`;
    return this.http.get<TipoEtapa>(url).pipe(
      tap(_ => console.log(`fetched Etapa id=${id}`)),
      catchError(this.handleError<TipoEtapa>(`getEtapa id=${id}`))
    )
  }

  getTipoEtapaBySector(idSector:number):Observable<IResponse<TipoEtapa[]>>{
    const url=`${apiUrl}/tipoEtapaPorSector/${idSector}`;
    return this.http.get<IResponse<TipoEtapa[]>>(url).pipe(
      tap(_=>console.log(`fetched Etapas para el sector=${idSector}`)),
      catchError(this.handleError<IResponse<TipoEtapa[]>>(`etapas del sector ${idSector}`))
    )
  }
  

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }

}
