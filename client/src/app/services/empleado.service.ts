import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Empleado} from '../models/empleado';
import { environment } from 'src/environments/environment';
import { IResponse } from '../models/iresponse';
import { MatSnackBar } from '@angular/material';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = `${environment.baseUrl}/empleado`;

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  
  constructor(private http: HttpClient,public _snackBar:MatSnackBar) { }

  getEmpleados(): Observable<IResponse<Empleado> | any> {
    return this.http.get<IResponse<Empleado[]> | any>(apiUrl)
      .pipe(
        tap(_ => this.log('fetched Empleados')),
        catchError(this.handleError<IResponse<Empleado> | any>('getEmpleados'))
      );
  }

  getEmpleado(id:string):Observable<Empleado>{
    const url=`${apiUrl}/${id}`;
    return this.http.get<Empleado>(url).pipe(
      tap(_ => console.log(`fetched Empleado id=${id}`)),
      catchError(this.handleError<Empleado>(`getEmpleado id=${id}`))
    )
  }

  addEmpleado (empleado: any): Observable<IResponse<Empleado> | any> {
    return this.http.post<IResponse<Empleado>>(apiUrl, empleado, httpOptions).pipe(
      tap(_ => this.openSnackBar(`empleado agregado con el legajo:${_.data.legajo}`,"Exito!")),
      catchError(this.handleError<IResponse<Empleado>>('addEmpleado'))
    );
  }

  updateEmpleado (id: string, empleado: any): Observable<IResponse<Empleado> | any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, empleado, httpOptions).pipe(
      tap(_ => this.openSnackBar(`Empleado actualizado`,"Exito!")),
      catchError(this.handleError<IResponse<Empleado> | any>('updateEmpleado'))
    );
  }

  deleteEmpleado (id: string): Observable<IResponse<Empleado> | any> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<IResponse<Empleado> | any>(url, httpOptions).pipe(
      tap(_ => this.openSnackBar(`${_.message}`,"Exito")),
      catchError(this.handleError<IResponse<Empleado> | any>('delete Empleado'))
    );
  }

  openSnackBar(mensaje1,mensaje2)
  {
    this._snackBar.open(mensaje1,mensaje2,{
      duration: 3000,
    })
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.error.message}`);
      this.openSnackBar(`${error.error.message}`,"Error");
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
