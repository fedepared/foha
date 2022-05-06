import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardianGuard implements CanActivate {
  isLoggedIn$: Observable<boolean>;
  isLoggedIn:boolean;
  constructor(private authService:AuthService, private router:Router,public _matSnackBar:MatSnackBar){
    this.isLoggedIn$=this.authService.checkSessionStorage();
    this.isLoggedIn$.subscribe(state => this.isLoggedIn=state);
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if(!this.isLoggedIn)
      {
        console.log("No estas logueado");
        this.router.navigate(['login']);
        this._matSnackBar.open("Debe iniciar sesión","Error!",{
          duration:3000
        })
      }
    // if(localStorage.getItem('isOp') === 'true')
    // {
    //   this.router.navigate(['procesos'])
    // }
    return true;
  }
  
}
