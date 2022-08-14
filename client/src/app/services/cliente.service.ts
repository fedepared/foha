import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Cliente } from '../models/cliente';
import { Observable, of } from 'rxjs';
import {environment} from '../../environments/environment';
import { IResponse } from '../models/iresponse';
import { MatSnackBar } from '@angular/material';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  apiUrl = `${environment.baseUrl}/Cliente`;
  

  constructor(private http: HttpClient,private _snackBar:MatSnackBar) { }

  getClientes(): Observable<IResponse<Cliente[]>|any> {
    return this.http.get<IResponse<Cliente[]>|any>(this.apiUrl)
      .pipe(
        tap(_ => this.log('fetched Clientes')),
        catchError(this.handleError('getClientes', []))
      );
  }

  getCliente(id:number):Observable<IResponse<Cliente>|any>{
      const url=`${this.apiUrl}/${id}`;
      return this.http.get<IResponse<Cliente>>(url).pipe(
        tap(_ => console.log(`fetched Cliente id=${id}`)),
        catchError(this.handleError<IResponse<Cliente>>(`getCliente id=${id}`))
      )
  }

  addCliente(cliente: any): Observable<IResponse<Cliente>|any> {
    return this.http.post<IResponse<Cliente>>(this.apiUrl, cliente, httpOptions).pipe(
      tap((_) => this.openSnackBar(`Cliente agregado con el id=${_.data.legajoCli}`,"Éxito!")),
      catchError(this.handleError<Cliente>('addCliente'))
    );
  }

  updateCliente (id: number, cliente: any): Observable<IResponse<Cliente>|any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<IResponse<Cliente>>(url, cliente, httpOptions).pipe(
      tap(_ => this.openSnackBar(`Cliente ${_.data.nombreCli} actualizado`,"Exito!")),
      catchError(this.handleError<IResponse<Cliente>>('updateCliente'))
    );
  }

  deleteTransformador (id: number): Observable<IResponse<Cliente>|any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<IResponse<Cliente>|any>(url, httpOptions).pipe(
      tap(_ => this.openSnackBar(`Cliente ${_.data.legajoCli} borrado`,"Exito!")),
      catchError(this.handleError<IResponse<Cliente>>('delete Cliente'))
    );
  }

  openSnackBar(mensaje1,mensaje2)
  {
    this._snackBar.open(mensaje1,mensaje2,{
      duration: 3000,
    })
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (response: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      this.openSnackBar(`${response.error.message}`,"ERROR!") // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${response.error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}

  
