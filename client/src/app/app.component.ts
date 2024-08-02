
import {MediaMatcher} from '@angular/cdk/layout';
import {Router,NavigationStart} from '@angular/router';
import {OnInit,ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import {DomSanitizer} from '@angular/platform-browser';
import { AuthService } from './services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { LoginComponent } from './auth/login/login.component';
import { MensajesService } from './services/mensajes.service';
import { TokenInterceptor } from './interceptors/token.interceptors';
import { async } from 'rxjs/internal/scheduler/async';
import { EtapaService } from './services/etapa.service';

export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';
  isOp:boolean;
  idTipoUs:string;
  sector:number;
  isLoggedIn$: Observable<boolean>;
  isLogged:boolean=false;
  subscription:Subscription;
//usDetail:Observable<Object>;

mobileQuery: MediaQueryList;
private _mobileQueryListener: () => void;
constructor(changeDetectorRef: ChangeDetectorRef,private etapaService:EtapaService, media: MediaMatcher,private router: Router,private matIconRegistry: MatIconRegistry,sanitizer: DomSanitizer,private authService:AuthService,private mensajesService:MensajesService) {
  this.mobileQuery = media.matchMedia('(max-width: 600px)');
  this._mobileQueryListener = () => changeDetectorRef.detectChanges();
  this.mobileQuery.addListener(this._mobileQueryListener);
  this.subscription = router.events.subscribe((event) => {
    if (event instanceof NavigationStart) {
      browserRefresh = !router.navigated;
      this.idTipoUs=localStorage.getItem('idTipoUs');
    }
});
  
  this.matIconRegistry.addSvgIcon(
    'fohama',
    sanitizer.bypassSecurityTrustResourceUrl('assets/logofohamaico.svg')
  );
  
  
}



ngOnInit() {
  
  
  
  
  this.isLoggedIn$=this.authService.checkSessionStorage();
  
  this.isOp=localStorage.getItem('isOp') === 'true';
  //this.idTipoUs=localStorage.getItem('idTipoUs');
  //this.getUser();

  
} 

// getUser(){
//   this.mensajesService.getMessage().subscribe(res=>{
//     console.log("Respuesta: ",res);
//     this.idTipoUs=res.idTipoUs;
//   })
// }



ngOnDestroy(): void {
  this.mobileQuery.removeListener(this._mobileQueryListener);
  
}

pausaIniciadasViejas(){
  this.etapaService.getPausarIniciadasViejas().subscribe(res=>{
    console.log(res);
  })
}

logout() {
  this.authService.logout();
}

//Agregar un Refresh

}