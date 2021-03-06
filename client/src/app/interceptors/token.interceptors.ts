import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private logged = new BehaviorSubject<boolean>(false);
  userChange$ = new BehaviorSubject({isOp: null, sector: null});
  get isLogged() {
     return this.logged.asObservable(); 
  }
    constructor(private router: Router,private _snackBar: MatSnackBar) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = localStorage.getItem('token');
        if (token) {
          // this.logged.next(true);
          request = request.clone({
            setHeaders: {
              'Authorization': `Bearer ${ token }`
            }
          });
        }
        if (!request.headers.has('Content-Type')) {
          request = request.clone({
            setHeaders: {
              'content-type': 'application/json'
            }
          });
        }
        request = request.clone({
          headers: request.headers.set('Accept', 'application/json')
        });
        return next.handle(request).pipe(
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              console.log('event--->>>', event);
            }
            return event;
          }),
          catchError((error: HttpErrorResponse) => {
            this.openSnackBar(error.message,'error');
            if (error.status === 401) {
              this.router.navigate['login'];
             
            }
            if (error.status===0)
            {
              this.openSnackBar('Servidor desconectado','error');
            }
            else{
              this.openSnackBar(`${error.message}`,"error")
            }
            return throwError(error);
          }));
    }

    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 5000,
      });
    }
}