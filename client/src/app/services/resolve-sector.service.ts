import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EtapaService } from './etapa.service';

@Injectable({
  providedIn: 'root'
})
export class ResolveSectorService implements Resolve<any> {

  constructor(private http: HttpClient,private etapaService:EtapaService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let sector=parseInt(localStorage.getItem("sector"));
    return this.etapaService.getColumns(sector);
  }
}
