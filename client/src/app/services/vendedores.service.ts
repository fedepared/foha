import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Vendedores } from '../models/vendedores';
import { Observable, of } from 'rxjs';
import {environment} from '../../environments/environment';
import { IResponse } from '../models/iresponse';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class VendedoresService {
  apiUrl = `${environment.baseUrl}/Vendedores`;
  constructor(private http:HttpClient,public _snackBar:MatSnackBar) { }

  getVendedores(): Observable<IResponse<Vendedores[]> |any> {
    return this.http.get<IResponse<Vendedores[]>>(this.apiUrl)
      .pipe(
        tap(_ => this.log('fetched Vendedores')),
        catchError(this.handleError('getVendedores', []))
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
