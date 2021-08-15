import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';
import { IResponse } from '../models/iresponse';
import { Usuario } from '../models/usuario';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = `${environment.baseUrl}/auth`;
  message:string;
  durationInSeconds:1;
  idTipoUs:number=0;
  sector:number=0;
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = new BehaviorSubject(false);
  userChange$ = new BehaviorSubject({idTipoUs: null, sector: null});
  get isLoggedIn() {
    return this.loggedIn.asObservable(); 
  }
  

  constructor(private http:HttpClient,private _snackBar: MatSnackBar,private router:Router) { 
    
   }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(_ => 
          {
            console.log(_);
            this.openSnackBar("Sesión iniciada","Ok!");
            this.loggedIn.next(true);
            this.isLoggedIn$.next(true);
            this.isAuthenticated();
            this.userChange(_.data.idTipoUs,_.data.sector);
            this.idTipoUs=_.data.idTipoUs;
            this.sector=_.data.sector;
            localStorage.setItem("sector",_.data.sector);
            localStorage.setItem("idTipoUs",_.data.idTipoUs);
          }
        ),
        catchError(this.handleError('login Failed', ))
      );
  }

  getUsers():Observable<any[]>{
    return this.http.get<any>(`${environment.baseUrl}/Usuario/userNames`)
    .pipe(
      tap(_ => this.log('get User Names')),
      catchError(this.handleError('get User Names', []))
    );
  }

  changePass(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/changePass`, data)
    .pipe(
      tap(_=>{
        this.openSnackBar("usuario modificado","Exito!");
      }),
      catchError(this.handleError("Changing Pass", ))
    )
  }

  public checkSessionStorage():Observable<boolean>{
    let bool=(localStorage.getItem('token') !== null);
    this.isLoggedIn$.next(bool);
    return this.isLoggedIn$.asObservable();
  }

  userChange(idTipoUs, sector){
    this.userChange$.next({
      idTipoUs: idTipoUs,
        sector: sector
    });
   }

   isLogged(){
     if(localStorage.getItem('sector'))
     {
       this.loggedIn.next(true);
      
     }
     
   }

   public isAuthenticated(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  logout(){
    this.router.navigate(['/login']);
    localStorage.clear();
    this.isLoggedIn$.next(false);
  }
  
  register(data: any): Observable<IResponse<Usuario>> {
    return this.http.post<any>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(_ => this.openSnackBar(`Usuario ${_.data.nombreUs} creado! `,"Exito")),
        catchError(this.handleError<Usuario>('Registro'))
      );
  }
  
  openSnackBar(mensaje,mensaje2) {
    this._snackBar.open(mensaje,mensaje2, {
       duration: this.durationInSeconds,
      });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse | any): Observable<T> => {
      const a=error.error;
      console.log(error)
      if(a)
      {
        if(a.hasOwnProperty('nombreUs'))
        {
          this.openSnackBar(`${a.nombreUs}`,"Error");
        }
        if(a.hasOwnProperty('pass'))
        {
          this.openSnackBar(`${a.pass}`,"Error");
        }
        if(a.hasOwnProperty('message'))
        {
          this.openSnackBar(`${a.message}`,"Error");
        }
      }
  
      if(error.status===401)
      {
        this.openSnackBar("Credenciales Inválidas","Error!")
      }
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      // return of(result as T);
      return of(error as T);
    };
  }
  
  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }

}
