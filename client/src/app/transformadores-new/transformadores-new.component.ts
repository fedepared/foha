import { Component, OnInit, Inject,ViewChild, Input, Output,EventEmitter, NgZone } from '@angular/core';
import { Transformadores } from '../models/transformadores';
import { TransformadoresService } from '../services/transformadores.service';
import { ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher, MatOption } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from "@angular/material/dialog";
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente';
import { TipoTransfo} from '../models/tipoTransfo';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource, MatTable} from '@angular/material/table';
import { EtapaService } from '../services/etapa.service';
import { Etapa } from '../models/etapa';
import { TipoEtapaService } from '../services/tipo-etapa.service';
import {TipoEtapa} from '../models/tipoEtapa';
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { TransformadoresEtapas } from '../models/transformadoresEtapas';
import { Vista } from '../models/Vista';
import { TipoTransfoService } from '../services/tipoTransfo';
import { ExcelService } from '../services/excel.service';
import { Colores } from '../models/colores';
import { ColoresService } from '../services/colores.service';
import { EtapaTransfo } from '../models/etapaTransfo';
//filtro
import {map, startWith} from 'rxjs/operators';
import * as jQuery from 'jquery';
import { MatCheckboxChange, MatDatepickerInputEvent, MatPaginator } from '@angular/material';
import { CourseDialog3Component } from '../clientes/clientes.component';
import { SelectionModel } from '@angular/cdk/collections';
import moment from 'moment';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { IResponse } from '../models/iresponse';
import { ExcelTimesService } from '../services/excel-times.service';
import { VendedoresService } from '../services/vendedores.service';
import { Vendedores } from '../models/vendedores'; 
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { style } from '@angular/animations';

const MAP_NOMBRE_ETAPA: { [tipoEtapa: string]: number} = {
        "DOC":1,
        "BT1":2,
        "BT2":3,
        "BT3":4,
        "AT1":5,
        "AT2":6,
        "AT3":7,
        "RG1":8,
        "RG2":9,
        "RG3":10,
        "RF1":11,
        "RF2":12,
        "RF3":13,
        // "ENS":14,
        "PY CYP":15,
        "PY SOL":16,
        "PY ENV":17,
        "CYP PAT":33,
        "PAT ENV":34,
        "NUC":18,
        "MON":19,
        "CON BT":35,
        "CON AT":36,
        "HOR":20,
        "CUBA CYP":21,
        "RAD \n PAN":23,
        "CUBI":43,
        "SOL \n CUBA":24,
        "HERM":25,
        "GRAN \n CUBA":26,
        "PINT \n CUBA":27,
        "ENV \n CUBA":38,
        "CYP \n TAPA":39,
        "SOL \n TAPA":22,
        "GRAN \n TAPA":40,
        "PINT \n TAPA":41,
        "ENV \n TAPA":42,
        "ENC":28,
        "LAB":29,
        "CH \n CAR":44,
        "TERM":30,
        "APR":31,
        "ENV":32
}

const MAP_NOMBRE_ETAPA_PAGOS: { [tipoEtapa: string]: number} = {
  "DOC":1,
  "BT1":2,
  "BT2":3,
  "BT3":4,
  "AT1":5,
  "AT2":6,
  "AT3":7,
  "RG1":8,
  "RG2":9,
  "RG3":10,
  "RF1":11,
  "RF2":12,
  "RF3":13,
  // "ENS":14,
  "PY CYP":15,
  "PY SOL":16,
  "PY ENV":17,
  "CYP PAT":33,
  "PAT ENV":34,
  "NUC":18,
  "MON":19,
  "CON BT":35,
  "CON AT":36,
  "HOR":20,
  "CUBA CYP":21,
  "RAD \n PAN":23,
  "CUBI":43,
  "SOL \n CUBA":24,
  "HERM":25,
  "GRAN \n CUBA":26,
  "PINT \n CUBA":27,
  "ENV \n CUBA":38,
  "CYP \n TAPA":39,
  "SOL \n TAPA":22,
  "GRAN \n TAPA":40,
  "PINT \n TAPA":41,
  "ENV \n TAPA":42,
  "ENC":28,
  "LAB":29,
  "CH \n CAR":44,
  "TERM":30,
  "APR":31,
  "PAGO":45,
  "ENV":32
}


interface Mes {
  value: number;
  viewValue: string;
}


@Component({
  selector: 'etapa-column-component3',
  template: `
  <ng-container *ngIf="etapa">
    <div [style.height]="'40px'" [style.border-left]="(etapa.idTipoEtapa==2 || etapa.idTipoEtapa==5 || etapa.idTipoEtapa==8 || etapa.idTipoEtapa==11|| etapa.idTipoEtapa==14) ? '2.5px solid rgba(56,56,56,0.60)' : ((etapa.idTipoEtapa==1) ? '3px solid rgb(56,56,56)': '1px solid rgb(56,56,56)')" [style.background-color] = "etapa.idColorNavigation ? etapa.idColorNavigation.codigoColor : 'white'" [matTooltip]="etapa.idColorNavigation ? etapa.idColorNavigation.leyenda : '' " style="text-align:center">
      <span style="padding-left:10px;" *ngIf="(etapa.tiempoParc)!='Finalizada' && (etapa.tiempoParc)!=null" ></span>
      <span style="display:inline;margin:0;width:24px;height:24px;text-align:center">
        <button mat-icon-button *ngIf="idTipoUs=='6' || ( (idTipoUs!='4' && idTipoUs!='5' ) && (etapa.dateIni==null || etapa.dateFin!==null) && showButton(etapa.idTipoEtapa)) " (click)=asignarRef(etapa) matTooltipPosition="above"  [matTooltip]="(etapa.observacion!=null) ? etapa.observacion:'No hay observacion'"><mat-icon>lens_blur</mat-icon></button>
        <button mat-icon-button *ngIf="(idTipoUs=='5' || idTipoUs=='4') && etapa.idTipoEtapa==45" (click)=asignarRef(etapa) matTooltipPosition="above"  matTooltip="Pago"><mat-icon style="color:gray">request_quote</mat-icon></button>
        
      </span>
      <!-- <span>{{etapa.idTipoEtapa}}</span> -->
    </div>
  </ng-container>
    
  `,

  styleUrls: ['./transformadores-new.component.css']
})
export class EtapaColumnComponent3{
  coloresArr:Colores[]=[];
  etapaSelected:Etapa;
  idTipoUs=null;
  sector=null;

  @Input() etapa:Etapa; actualizar:Boolean;
  @Output() actualizado=new EventEmitter<Boolean>();



  constructor(private coloresService:ColoresService,public dialog: MatDialog){}

  ngOnInit(){
    this.idTipoUs=localStorage.getItem("idTipoUs");
    this.sector = parseInt(localStorage.getItem('sector'));
  }

  getColores(): void{
    this.coloresService.getColores()
    .subscribe(colores=>{
      this.coloresArr=colores;
    },err=>{
      console.log(err)
    })
  }
  asignarRef(row){

    this.etapaSelected=row;
    const dialogConfig = new MatDialogConfig();


    dialogConfig.data = {
        etapaSelected:this.etapaSelected,
        coloresArr:this.coloresArr
    };
    dialogConfig.width= '700px';
    const dialogRef = this.dialog.open(AssignColorComponent2, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if(data){
        this.actualizado.emit(true)
      }
      else
      {
        this.actualizado.emit(false);
      }
    })
  }

  showButton(idTipoEtapa:number):boolean{
    
    let arrayTipoEtapas=[];
    switch (this.sector){
      case 1:
            arrayTipoEtapas=[1];
            return arrayTipoEtapas.some((x)=>x==idTipoEtapa);

            // etapasPorSector.Add("DOC",1);
      case 2:
            arrayTipoEtapas=[2,3,4,5,6,7,8,9,10,11,12,13,14];
            return arrayTipoEtapas.some((x)=>x==idTipoEtapa);
            // etapasPorSector.Add("BT1",2);
            // etapasPorSector.Add("BT2",3);
            // etapasPorSector.Add("BT3",4);
            // etapasPorSector.Add("AT1",5);
            // etapasPorSector.Add("AT2",6);
            // etapasPorSector.Add("AT3",7);
            // etapasPorSector.Add("RG1",8);
            // etapasPorSector.Add("RG2",9);
            // etapasPorSector.Add("RG3",10);
            // etapasPorSector.Add("RF1",11);
            // etapasPorSector.Add("RF2",12);
            // etapasPorSector.Add("RF3",13);
            //etapasPorSector.Add("ENS",14);  
            break;
      case 3:
            arrayTipoEtapas=[21,23,43,24,25,26,27,38,39,22,40,41,42,15,16,17,33,34];
            return arrayTipoEtapas.some((x)=>x==idTipoEtapa);
            // etapasPorSector.Add("CUBA CYP",21);
            // etapasPorSector.Add("RAD \n PAN",23);
            // etapasPorSector.Add("CUBI",43);
            // etapasPorSector.Add("SOL \n CUBA",24);
            // etapasPorSector.Add("HERM",25);
            // etapasPorSector.Add("GRAN \n CUBA",26);
            // etapasPorSector.Add("PINT \n CUBA",27);
            // etapasPorSector.Add("ENV \n CUBA",38);
            // etapasPorSector.Add("CYP \n TAPA",39);
            // etapasPorSector.Add("SOL \n TAPA",22);
            // etapasPorSector.Add("GRAN \n TAPA",40);
            // etapasPorSector.Add("PINT \n TAPA",41);
            // etapasPorSector.Add("ENV \n TAPA",42);
            // etapasPorSector.Add("PY CYP",15);
            // etapasPorSector.Add("PY SOL",16);
            // etapasPorSector.Add("PY ENV",17);
            // etapasPorSector.Add("CYP PAT",33);
            // etapasPorSector.Add("PAT ENV",34);
      case 4:
            arrayTipoEtapas=[18];
            // etapasPorSector.Add("NUC",18);
            return arrayTipoEtapas.some((x)=>x==idTipoEtapa);
      case 5:
            arrayTipoEtapas=[,19,20,35,36];
            return arrayTipoEtapas.some((x)=>x==idTipoEtapa);
            // etapasPorSector.Add("MON",19);
            // etapasPorSector.Add("HOR",20);
            // etapasPorSector.Add("CON BT",35);
            // etapasPorSector.Add("CON AT",36);
      case 6:
            arrayTipoEtapas=[20];
            return arrayTipoEtapas.some((x)=>x==idTipoEtapa);
            // etapasPorSector.Add("HOR",20);
      case 7:
            arrayTipoEtapas=[20,28];
            return arrayTipoEtapas.some((x)=>x==idTipoEtapa);
            // etapasPorSector.Add("HOR",20);
            // etapasPorSector.Add("ENC",28);
      case 8:
            arrayTipoEtapas=[37,29,44,31];
            return arrayTipoEtapas.some((x)=>x==idTipoEtapa);
            // etapasPorSector.Add("REL TRANSF",37);
            // etapasPorSector.Add("LAB",29);
            // etapasPorSector.Add("CH \n CAR",44);
            // etapasPorSector.Add("APR",31);
      case 9:                
            arrayTipoEtapas=[44,30,31,32];
            return arrayTipoEtapas.some((x)=>x==idTipoEtapa);
            // etapasPorSector.Add("CH \n CAR",44);
            // etapasPorSector.Add("TERM",30);
            // etapasPorSector.Add("APR",31);
            // etapasPorSector.Add("ENV",32);
      case 10:
            arrayTipoEtapas=[1,2,3,4,5,6,7,8,9,10,11,12,13,15,16,17,33,34,18,19,35,36,37,20,21,23,43,24,25,26,27,38,39,22,40,41,42,28,29,44,30,31,32];
            return arrayTipoEtapas.some((x)=>x==idTipoEtapa);
            // etapasPorSector.Add("DOC",1);
            // etapasPorSector.Add("BT1",2);
            // etapasPorSector.Add("BT2",3);
            // etapasPorSector.Add("BT3",4);
            // etapasPorSector.Add("AT1",5);
            // etapasPorSector.Add("AT2",6);
            // etapasPorSector.Add("AT3",7);
            // etapasPorSector.Add("RG1",8);
            // etapasPorSector.Add("RG2",9);
            // etapasPorSector.Add("RG3",10);
            // etapasPorSector.Add("RF1",11);
            // etapasPorSector.Add("RF2",12);
            // etapasPorSector.Add("RF3",13);
            //estabacomentada la siguiente linea
            ////etapasPorSector.Add("ENS",14);
            // etapasPorSector.Add("PY CYP",15);
            // etapasPorSector.Add("PY SOL",16);
            // etapasPorSector.Add("PY ENV",17);
            // etapasPorSector.Add("CYP PAT",33);
            // etapasPorSector.Add("PAT ENV",34);
            // etapasPorSector.Add("NUC",18);
            // etapasPorSector.Add("MON",19);
            // etapasPorSector.Add("CON BT",35);
            // etapasPorSector.Add("CON AT",36);
            // etapasPorSector.Add("REL \n TRA",37);
            // etapasPorSector.Add("HOR",20);
            // etapasPorSector.Add("CUBA \n CYP",21);
            // etapasPorSector.Add("RAD \n PAN",23);
            // etapasPorSector.Add("CUBI",43);
            // etapasPorSector.Add("SOL \n CUBA",24);
            // etapasPorSector.Add("HERM",25);
            // etapasPorSector.Add("GRAN \n CUBA",26);
            // etapasPorSector.Add("PINT \n CUBA",27);
            // etapasPorSector.Add("ENV \n CUBA",38);
            // etapasPorSector.Add("CYP \n TAPA",39);
            // etapasPorSector.Add("SOL \n TAPA",22);
            // etapasPorSector.Add("GRAN \n TAPA",40);
            // etapasPorSector.Add("PINT \n TAPA",41);
            // etapasPorSector.Add("ENV \n TAPA",42);
            // etapasPorSector.Add("ENC",28);
            // etapasPorSector.Add("LAB",29);
            // etapasPorSector.Add("CH. \n CAR",44);
            // etapasPorSector.Add("TERM",30);
            // etapasPorSector.Add("APR",31);
            
        //encubado Enc
        case 12:
            arrayTipoEtapas=[20,28,32,29,30,31];
            return arrayTipoEtapas.some((x)=>x==idTipoEtapa);
            // etapasPorSector.Add("HOR",20);
            // etapasPorSector.Add("ENC",28);
            // etapasPorSector.Add("ENV",32);
            // etapasPorSector.Add("LAB",29);
            // etapasPorSector.Add("TERM",30);
            // etapasPorSector.Add("APR",31);

        //caldereria enc 
        case 21:
            break;
        //cyp
        case 22:
            arrayTipoEtapas=[15,33,21];
            return arrayTipoEtapas.some((x)=>x==idTipoEtapa);
            // etapasPorSector.Add("PY CYP",15);
            // etapasPorSector.Add("CYP PAT",33);
            // etapasPorSector.Add("CUBA CYP",21);
        //soldadura
        case 23:
            arrayTipoEtapas=[43,16,22,24];
            return arrayTipoEtapas.some((x)=>x==idTipoEtapa);
            // etapasPorSector.Add("CUBI",43);
            // etapasPorSector.Add("PY SOL",16);
            // etapasPorSector.Add("SOL \n TAPA",22);
            // etapasPorSector.Add("SOL \n CUBA",24);
        //granallado
        case 24:
          arrayTipoEtapas=[22,24,25,26,40];
          return arrayTipoEtapas.some((x)=>x==idTipoEtapa);
            //etapasPorSector.Add("SOL \n TAPA",22);//Pedido Lucas Solo Lectura
            //etapasPorSector.Add("SOL \n CUBA",24);//Pedido Lucas Solo Lectura
            //etapasPorSector.Add("HERM",25);
            //etapasPorSector.Add("GRAN \n CUBA",26);
            //etapasPorSector.Add("GRAN \n TAPA",40);
            
        //pintura
        case 25:
          arrayTipoEtapas=[26,40,27,41];
          return arrayTipoEtapas.some((x)=>x==idTipoEtapa);
            // etapasPorSector.Add("SOL \n TAPA",22);
            // etapasPorSector.Add("GRAN \n CUBA",26);
            // etapasPorSector.Add("GRAN \n TAPA",40);
            // etapasPorSector.Add("PINT \n CUBA",27);
            // etapasPorSector.Add("PINT \n TAPA",41);
        //SuperAdmin
        case 26:
          arrayTipoEtapas=[1,2,3,4,5,6,7,8,9,10,11,12,13,15,16,17,33,34,18,19,35,36,37,20,21,23,43,24,25,26,27,38,39,22,40,41,42,28,29,44,30,31,45,32];
          return arrayTipoEtapas.some((x)=>x==idTipoEtapa);
            // etapasPorSector.Add("DOC",1);
            // etapasPorSector.Add("BT1",2);
            // etapasPorSector.Add("BT2",3);
            // etapasPorSector.Add("BT3",4);
            // etapasPorSector.Add("AT1",5);
            // etapasPorSector.Add("AT2",6);
            // etapasPorSector.Add("AT3",7);
            // etapasPorSector.Add("RG1",8);
            // etapasPorSector.Add("RG2",9);
            // etapasPorSector.Add("RG3",10);
            // etapasPorSector.Add("RF1",11);
            // etapasPorSector.Add("RF2",12);
            // etapasPorSector.Add("RF3",13);
            //linea de abajo comentada
            ////etapasPorSector.Add("ENS",14);
            // etapasPorSector.Add("PY CYP",15);
            // etapasPorSector.Add("PY SOL",16);
            // etapasPorSector.Add("PY ENV",17);
            // etapasPorSector.Add("CYP PAT",33);
            // etapasPorSector.Add("PAT ENV",34);
            // etapasPorSector.Add("NUC",18);
            // etapasPorSector.Add("MON",19);
            // etapasPorSector.Add("CON BT",35);
            // etapasPorSector.Add("CON AT",36);
            // etapasPorSector.Add("REL \n TRA",37);
            // etapasPorSector.Add("HOR",20);
            // etapasPorSector.Add("CUBA \n CYP",21);
            // etapasPorSector.Add("RAD \n PAN",23);
            // etapasPorSector.Add("CUBI",43);
            // etapasPorSector.Add("SOL \n CUBA",24);
            // etapasPorSector.Add("HERM",25);
            // etapasPorSector.Add("GRAN \n CUBA",26);
            // etapasPorSector.Add("PINT \n CUBA",27);
            // etapasPorSector.Add("ENV \n CUBA",38);
            // etapasPorSector.Add("CYP \n TAPA",39);
            // etapasPorSector.Add("SOL \n TAPA",22);
            // etapasPorSector.Add("GRAN \n TAPA",40);
            // etapasPorSector.Add("PINT \n TAPA",41);
            // etapasPorSector.Add("ENV \n TAPA",42);
            // etapasPorSector.Add("ENC",28);
            // etapasPorSector.Add("LAB",29);
            // etapasPorSector.Add("CH. \n CAR",44);
            // etapasPorSector.Add("TERM",30);
            // etapasPorSector.Add("APR",31);
            // etapasPorSector.Add("PAGO",45);
            // etapasPorSector.Add("ENV",32);
            break;
    }
  }



}

@Component({
  selector: "asignar-colores",
  templateUrl: "asignar-colores.html"
})
export class AssignColorComponent2{
  etapaSelected:Etapa;
  coloresArr:Colores[];
  data:MatTableDataSource<Colores>;
  displayedColumns:string[]=['select','color','leyenda']
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private dialogRef: MatDialogRef<AssignColorComponent2>,private coloresService:ColoresService,public dialog: MatDialog,private etapaService:EtapaService,
    @Inject(MAT_DIALOG_DATA) data1
  ) {
      this.etapaSelected=data1.etapaSelected
  }



  ngOnInit(){
    this.getColores();
  }

  getColores():void{
    this.coloresService.getColores()
    .subscribe(colores=>{
      this.coloresArr=colores;
      if(localStorage.getItem("idTipoUs")!='5' && localStorage.getItem("idTipoUs")!='4')
      {
        let blanco:Colores={idColor:999999,codigoColor:"#ffffff",leyenda:"borrar referencia"}
        this.coloresArr.push(blanco);
        if(this.etapaSelected.isEnded==true)
        {
          this.coloresArr=this.coloresArr.filter(x=>x.idColor==9);
        }
      }
      else{
        
        this.coloresArr=this.coloresArr.filter((x)=>{
          return x.idColor==10 || x.idColor==1032 || x.idColor==1040;
        });
      }
      this.data=new MatTableDataSource();
      this.data.data = this.coloresArr;
      this.data.sort = this.sort;
    },err=>{
      console.log(err)
    })
  }

  onRowClick(row){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
        colorSelected:row,
        observacion:"",
        titulo:"¿Desea asignar la siguiente referencia al proceso seleccionado?"
    };
    if(this.etapaSelected.isEnded==true)
    {
      dialogConfig.data.titulo="¡Este proceso se encuentra finalizado! ¿Desea reanudar el proceso?"
    }
    dialogConfig.width= '400px';
    dialogConfig.height = '600px';
    const dialogRef = this.dialog.open(ConfirmAssignDialog, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if(data){
        console.log(data);
        if(data.colorSelected.idColor!=9)
        {
          if(data.colorSelected.idColor==999999)
          {
            this.etapaSelected.idColor=null;
            this.etapaSelected.idColorNavigation=null;
          }
          else{
            this.etapaSelected.idColor=data.colorSelected.idColor;
          }
          this.etapaSelected.observacion=data.observacion
          this.etapaService.updateEtapa(this.etapaSelected.idEtapa,this.etapaSelected)
          .subscribe(res=>{
              this.dialogRef.close(res);
            },err=>{
              console.log(err)
          })
        }
        else{
          this.etapaService.updateReanudarEtapa(this.etapaSelected.idEtapa,this.etapaSelected)
          .subscribe(res=>{
              this.dialogRef.close(res);
            },err=>{
              console.log(err)
          })
        }
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();
    if (this.data.paginator) {
      this.data.paginator.firstPage();
    }
  }

}

@Component({
  selector: "confirm-assign.html",
  templateUrl: "confirm-assign.html",
  styleUrls:["transformadores-new.component.css"]
})
export class ConfirmAssignDialog{
  colorSelected:Colores;
  titulo:"";
  observacion:string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmAssignDialog>,public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data1
  ) {
      this.colorSelected=data1.colorSelected;
      this.observacion=data1.observacion;
      this.titulo=data1.titulo;

    }

    save(){
      this.dialogRef.close({colorSelected:this.colorSelected,observacion:this.observacion});
    }
    onNoClick(){
      this.dialogRef.close();
    }

  }










@Component({
  selector: 'app-transformadores-new',
  templateUrl: './transformadores-new.component.html',
  styleUrls: ['./transformadores-new.component.css']
})
export class TransformadoresNewComponent implements OnInit {
  isLoadingResults = true;
  dataGetTrafos:MatTableDataSource<any>;
  dataExcel:TransformadoresEtapas[];
  data3:Cliente[]=[];
  data4:Etapa[]=[];
  diego:ComboClientes[]=[];
  idTransfo:number;
  durationInSeconds=3;
  data2:Transformadores;
  data5:Etapa[]=[];
  data6:TipoEtapa[]=[];
  data7:EtapaTransfo[]=[];
  mensajeSnack:string;
  arrayBool:boolean;
  muestre:boolean=false;
  vista:Vista[];
  selectColumn=false;

  //historicos 
  historics = false;

  //rangos
  ranges = false;

  selection = new SelectionModel<any>(true, []);


  dataTipoTransfo:ComboTipoTransfo[]=[];
  tipoTransfo:TipoTransfo[]=[];
  pageNumber:number=1;


  colores:Colores[]=[];
  displayedColumns0:string[]=['prioridad'];
  displayedColumns1:string[]=['select','Accion']
  displayedColumns2:string[]=[
    'oTe',
    'serie',
    'nucleos',
    'oPe',
    'rangoInicio',
    'lote',
    'potencia',
    'fechaPactada',
    'nombreCli',
    'idVendedorNavigation',
    'fechaProd',
    'observaciones'
  ]
  //esto es una forma cheta de obtener el array con los nombres de
  //las columnas que machean con el "nombreTipoEtapa".

  // etapasColumns: string[]=  Object.keys(MAP_NOMBRE_ETAPA_PAGOS);
  etapasColumns: string[]= (localStorage.getItem("idTipoUs") === '5' || localStorage.getItem("idTipoUs") === '4' || localStorage.getItem("idTipoUs")==='6') ? Object.keys(MAP_NOMBRE_ETAPA_PAGOS) : Object.keys(MAP_NOMBRE_ETAPA);

  // TODAS las columnas
  allColumns: string[]= this.displayedColumns0.concat(this.displayedColumns1).concat(this.displayedColumns2).concat(this.etapasColumns);

  etapasActualizadas:boolean;

  //vendedores
  vendedores:Vendedores[]=[];

  //Filtro
  form=new FormGroup(
    {
      oTeDesde:new FormControl(),
      oTeHasta:new FormControl(),
      nucleos:new FormControl(),
      oPeDesde:new FormControl(),
      oPeHasta:new FormControl(),
      rangoInicioDesde:new FormControl(),
      rangoInicioHasta:new FormControl(),
      rangoFin:new FormControl(),
      serieDesde: new FormControl(),
      serieHasta: new FormControl(),
      observaciones:new FormControl(),
      potenciaDesde:new FormControl(),
      potenciaHasta:new FormControl(),
      nombreCli	:new FormControl(),
      fechaPactada:new FormControl(),
      fechaProd:new FormControl(),
      vendedor:new FormControl(),
      month:new FormControl(),
      tTransfo:new FormControl()
    }
  )


    oTeDesde='';
    oTeHasta='';
    oPeDesde='';
    oPeHasta='';
    rangoInicioDesde='';
    rangoInicioHasta='';
    potenciaDesde='';
    potenciaHasta='';
    serieDesde='';
    serieHasta='';
    nucleos='';
    nombreCli='';
    observaciones='';
    vendedor='';
    month=[];
    year=[];
    tTransfo='';
    fechaPactada='';
    fechaProd='';

  
  mes:Mes[]=[
    {value:1,viewValue:"Enero"},
    {value:2,viewValue:"Febrero"},
    {value:3,viewValue:"Marzo"},
    {value:4,viewValue:"Abril"},
    {value:5,viewValue:"Mayo"},
    {value:6,viewValue:"Junio"},
    {value:7,viewValue:"Julio"},
    {value:8,viewValue:"Agosto"},
    {value:9,viewValue:"Septiembre"},
    {value:10,viewValue:"Octubre"},
    {value:11,viewValue:"Noviembre"},
    {value:12,viewValue:"Diciembre"},
    {value:13,viewValue:"Stock"}
  ].sort((a,b)=>{
    if(a.value - b.value)
    return -1;
    if(b.value - a.value)
    return 1;
    return 0;
  });

  //variable para los meses
  months=null;

  //variable para el tipo de usuario
  idTipoUs=null;




  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, { static: false }) matTable: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('allSelected') private allSelected: MatOption;
  constructor(private ngZone: NgZone,private transformadoresService: TransformadoresService, public dialog: MatDialog,private _snackBar: MatSnackBar,private etapaService: EtapaService, private tipoEtapaService: TipoEtapaService, private excelService: ExcelService,private coloresService:ColoresService, private excelTimesService:ExcelTimesService, private vendedoresService:VendedoresService, private tipoTransfoService: TipoTransfoService) {

    }



  ngOnInit(): void {
    this.idTipoUs=localStorage.getItem("idTipoUs");
    this.dataGetTrafos=new MatTableDataSource();
    this.dataGetTrafos.filterPredicate = ((data, filter: string): boolean => {
      const filterValue = JSON.parse(filter);
      
      //mostrar historicos
      if(filterValue){
        return true;
      }
      //ocultar historicos
      else{
        if(data.hasOwnProperty('group'))
        {
          return true;
        }
        else{
          let today = new Date().getTime();
          let ended = data.etapa.filter(x=>(x.idTipoEtapa==32 && x.isEnded===true && x.idColor!=1034) && ((today - new Date(x.dateFin).getTime())/(1000*3600*24))>60);
          if(ended.length>0 || data.idTipoTransfo==7){
            return false;
          }
          else return true;
        }
      }
    
    })
    this.getTrafos();
    this.getHistorics();
    this.getMonthYear();
    this.getSellers();
    this.getTipoTransfo();
    this.disableRanges();
  }

  function(event){
    event.preventDefault();
    this.applyApiFilter();
  }


  encabezadosTrafo(trafo:string){
    let encabezado = {
      'oTe': 'OT | OR',
      'oPe': 'OP',
      'rangoInicio': 'RNG',
      'lote': 'CANT',
      'potencia': 'POT',
      'serie': 'SER',
      'nucleos':'NUC',
      'radPan': 'R/P',
      'nombreCli': 'CLI',
      'idVendedorNavigation': 'VEND',
      'observaciones': 'OBS',
      'fechaPactada': 'FOT',
      'fechaProd': 'FPR'
    };
    return encabezado[trafo];
    
  }


  colorFOT(element)
  {
    if(element.fechaProd>element.fechaPactada)
    {
      return "fot";
    }
  }

  

  breakCli(cli:string){
    if(cli!=null)
    {
      return cli.substring(0,8);
    }
    else {
      return ""
    }
  }

  breakObs(obs:string){
    if(obs!=null)
    {
      if(obs.length>15)
      {
        return obs.substring(0,16)
      }
      else{
        return obs.substring(0,obs.length+1)
      }
    }
    else{
      return ""
    }
  }

  tooltipTrafo(trafo:string){
    let toolTipTrafo = {
      'oTe':'OT',
      'oPe':'OP',
      'serie':'Serie',
      'rangoInicio':'Rango',
      'lote':'Cantidad Lote',
      'potencia':'Potencia',
      'nucleos':'Nucleo',
      'nombreCli':'Cliente',
      'observaciones':'Observaciones',
      'fechaPactada':'Fecha segun OT',
      'fechaProd':'Fecha Producción',
      'idVendedorNavigation':'Vendedor',
    }
    return toolTipTrafo[trafo];
    
  }

  op(ope){
    if(ope==0) 
    {
      return "OR"
    }
    else
    {
      return ope
    } 
  }

  toolTipEtapas(etapa:string)
  {
    let et =
    {
      "DOC":"Documentación",
      "BT1":"Bob BT",
      "BT2":"Bob BT",
      "BT3":"Bob BT",
      "AT1":"Bob AT",
      "AT2":"Bob AT",
      "AT3":"Bob AT",
      "RG1":"Bob RG",
      "RG2":"Bob RG",
      "RG3":"Bob RG",
      "RF1":"Bob RF",
      "RF2":"Bob RF",
      "RF3":"Bob RF",
      // "ENS":"Ensamblaje Bobinas",
      "PY CYP":"C Y P PYS",
      "PY SOL":"Soldadura Prensayugos",
      "PY ENV":"Envio de PYS",
      "NUC":"Nucleo",
      "MON":"Montaje",
      "HOR":"Horno",
      "CUBA CYP":"C Y P Tapa-Cuba",
      "SOL \n TAPA":"TAPA",
      "RAD \n PAN":"Radiadores o Paneles",
      "CUBA":"Cuba",
      "HERM":"Hermeticidad",
      "GRAN":"Granallado",
      "PINT":"Pintura",
      "ENC":"Encubado",
      "LAB":"Ensayos(Ref)",
      "TERM":"Terminacion",
      "APR":"Aprobacion",
      "ENV":"Envío a cliente",
      "CYP PAT":"C Y P PATAS",
      "PAT ENV":"ENVIO PATAS",
      "CON BT":"CONEXION BT",
      "CON AT":"CONEXION AT",
      "REL \n TRA":"RELACION DE TRANSFORMACION",
      "SOL \n CUBA":"SOLDADURA CUBA",
      "GRAN \n CUBA":"GRANALLADO CUBA",
      "PINT \n CUBA":"PINTURA CUBA",
      "ENV \n CUBA":"ENVIO CUBA",
      "CYP \n TAPA":"C Y P TAPA",
      "GRAN \n TAPA":"GRANALLADO TAPA",
      "PINT \n TAPA":"PINTURA TAPA",
      "ENV \n TAPA":"ENVIO TAPA",
      "CUBI":"CUBIERTA",
      "CH \n CAR":"Chapa de características",
    }
    return et[etapa];
  }




  //Obtiene la etapa de un transformador en base al nombre de la etapa
  getEtapa(t:any, nombreEtapa: string,i): any {
    // console.log(i)
    // let matchEtapa = t.etapa.filter(etapa => etapa.idTipoEtapa == MAP_NOMBRE_ETAPA[nombreEtapa]);
    
    // if(matchEtapa.length!=0)
    // {
    //   return matchEtapa[0];
    // }
    if(this.etapasActualizadas==true)
    {
      this.getTrafos();
    }

    //Filtro si es de tipo cobranzas
    if(localStorage.getItem("idTipoUs")=='5' || localStorage.getItem("idTipoUs")=='4' || localStorage.getItem("idTipoUs")=='6')
    {
      return t.etapa[i];
    }  
    else{
      const a=t.etapa.filter(x=>x.idTipoEtapa!=45);
      return a[i];

    }
  }

  actualizar(evento:any){
    if(evento==true)
    {
      this.getTrafos();
    }
  }



    mostrar(){
      this.muestre=true;
    }

    getColores():void{
      this.coloresService.getColores()
      .subscribe(colores=>{
        this.isLoadingResults=false;
      },err=>{
        console.log(err),
        this.isLoadingResults=false;
      })
    }

    getTrafos():void{
      this.openSnackBar("Cargando Información","...");
      if(!Object.values(this.form.value).some(x => x !== null && x !== ''))
      {
        this.transformadoresService.getPrueba(this.pageNumber).subscribe(transfo=>{
          console.log(transfo);
          this.isLoadingResults = true;
          this.dataGetTrafos.paginator = this.paginator;

          this.dataGetTrafos.data=transfo.data;

        }, err => {
            this.isLoadingResults = false;
          },
          () =>{
            this.isLoadingResults=false;
            this.openSnackBar("Información cargada","Exito!")
          }
          );
      }
      else{
        this.applyApiFilter();
      }
    }

    getMonthYear(){
      this.transformadoresService.getMonthYear().subscribe(res=>{
        this.months=res;
      })
    }

    getSellers(){
      this.vendedoresService.getVendedores().subscribe(res =>{
        this.vendedores = res.data;
      })
    }

    getTipoTransfo(){
      this.tipoTransfoService.getTipoTransfo().subscribe(res => {
        this.tipoTransfo = res;
      })
    }

    isGroup(index, item): boolean{
      return item.group;
    }

    showOrHide(){
      if(this.selection.selected.length>0 && this.selectColumn==true)
      {
        this.selection.clear();
      }
      this.selectColumn=!this.selectColumn;

    }
    openSnackBar(mensaje1,mensaje2) {
      this._snackBar.open(mensaje1,mensaje2, {
         duration: this.durationInSeconds * 1000,
        });
    }

    dialogAddTransfo(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          titulo: "Agregar Transformador",
          labelButton:"Agregar",

        };
        const dialogRef = this.dialog.open(AddTransfoComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(data => {
          if(data){
            this.getTrafos();
          }
        })
      }

      dialogEditTransfo(obj): void {
        obj.titulo="Editar Transformador";
        obj.labelButton="Guardar";
        const dialogRef3 = this.dialog.open(EditDeleteTransfoComponent, { data:obj});
        dialogRef3.afterClosed().subscribe(res =>{
          if(res)
          {
            this.getTrafos()
          }
        })
      }

      dialogEditAllTransfo(): void {
        console.log(this.selection.selected);
        let data={
          titulo:"Editar Transformadores",
          labelButton:"Guardar",
          diego:this.diego,
          trafosToModify:this.selection.selected,
          dataTipoTransfo:this.tipoTransfo,
          dataTrafos:this.dataGetTrafos,
          colores:this.colores,
          habilitar:true,
          cancelado:false
        }

        console.log(data);

        const dialogRef3 = this.dialog.open(EditAllTrafosNewComponent, {
          width:'60vw',
          data:data
        });
        dialogRef3.afterClosed().subscribe(res =>{
          if(res !== undefined)
          {
            let idTrafos=[];
            let arrayOfProccess=[];

            //Modificar etapas
            if(res.hasOwnProperty('ArrayTrafo'))
            {
              this.modifyProcesses(res);

            }
            //Modificar datos de cabecera
            else{
              for (let a of this.selection.selected)
              {
                a.fechaPactada= (res.fechaPactada != null) ? res.fechaPactada.toDate() : a.fechaPactada;
                a.fechaProd= (res.fechaProd != null) ? res.fechaProd.toDate() : a.fechaProd;
                a.idCliente= (res.f !=null) ? res.f.idCliente : a.idCliente;
                a.nombreCli = (res.f != null ) ? res.f.nombreCli : a.nombreCli;
                a.idTipoTransfo= (res.idTipoTransfo != null) ? res.idTipoTransfo : a.idTipoTransfo;
                a.nucleos= (res.nucleos != null) ? res.nucleos : a.nucleos;
                a.oPe= (res.oPe != null) ? res.oPe : a.oPe;
                a.oTe= (res.oTe != null) ? res.oTe : a.oTe;
                a.observaciones = (res.observaciones != null) ? res.observaciones : a.observaciones;
                a.potencia= (res.potencia != null) ? res.potencia : a.potencia;
                a.radPan = (res.radPan  != null) ? res.radPan : a.radPan;
                a.mes = (res.mes  != null) ? res.mes : a.mes;
                a.anio = (res.anio  != null) ? res.anio : a.anio;
                a.lote = (res.lote  != null) ? res.lote : a.lote;
                a.idVendedor = (res.idVendedor !=null) ? ((res.idVendedor == 0) ? null : res.idVendedor) : a.idVendedor;
                a.serie = (res.serie != null) ? res.serie:a.serie;
              
              }

              this.onUpdateAllTrafos(this.selection.selected);
            }
          }

          this.selection = new SelectionModel<any>(true, []);

        })

      }

      modifyProcesses(editAllTrafoEtapa){
        this.etapaService.modifyProcesses(editAllTrafoEtapa).subscribe(res => {
          console.log(res);
        },
        err => {
          this.isLoadingResults = false;
        },
        ()=>{
          this.getTrafos();
        }
        );
      }


      onUpdateAllTrafos(trafos){
        this.isLoadingResults = true;
        if(this.idTransfo!==null){
          this.transformadoresService.updateAllTrafos(trafos).subscribe(
            () => {

              this.isLoadingResults = false;

            },
            err => {
              this.isLoadingResults = false;
            },
            ()=>{
              this.getTrafos();

            }
            );
          }
      }

      dialogDeleteTransfo(obj): void{
        obj.titulo="Borrar transformador?";
        obj.labelButton="Borrar";
        const dialogRef3 = this.dialog.open(EditDeleteTransfoComponent, { data:obj});
        dialogRef3.afterClosed().subscribe(res =>{
          if(res)
          {
            this.getTrafos()
          }
        })
      }

      dialogDeleteAllTransfo():void{
        console.log(this.selection.selected);
        let data={
          titulo:"Borrar Transformadores",
          labelButton:"Borrar",
          header:"¿Desea Borrar los siguientes transformadores?",
          trafosToDelete:this.selection.selected
        }
        const dialogDAT = this.dialog.open(DeleteAllTransfoDialog, {
          data:data
        });

        dialogDAT.afterClosed().subscribe(()=>{
          this.selection.clear();
          this.getTrafos();
        })

      }

      export(){
        this.excelService.generateExcel(this.dataGetTrafos.data);
      }

      exportTimes(){
        this.excelTimesService.generateExcel(this.dataGetTrafos.data);
      }



      getTipoEtapas(): Observable<any> {
        return this.tipoEtapaService.getTipoEtapas().pipe(
          tap(tipoEtapa => this.data6 = tipoEtapa)
        )
      }

      getEtapasporTransfo(id:number): Observable<Etapa[]> {
        return this.etapaService.getEtapasPorIdTransfo(id).pipe(
          tap(etapa => this.data5 = etapa)
        );
      }

      asignarEtapaTransfo(){
        this.data7=[];
        this.data5.forEach((e,i)=>{
          let obj = new EtapaTransfo;
          this.data6.forEach((e,j)=>{
              if(this.data5[i].idTipoEtapa==this.data6[j].idTipoEtapa)
              {

                obj.nombreEtapa=this.data6[j].nombreEtapa;

              }
            })
          obj.dateIni=this.data5[i].dateIni;
          obj.dateFin=this.data5[i].dateFin;
          obj.tiempoParc=this.data5[i].tiempoParc;
          obj.tiempoFin=this.data5[i].tiempoFin;
          this.data7.push(obj);
          })
      }

      openDialogEtapaTransfo(obj):void{

          const dialogRef5 = this.dialog.open(ShowInfoNewComponent,{
            width:'100%',
            position: {
              left: `100px`,

            },
            data:obj,
          })
          dialogRef5.afterClosed().subscribe(result => {

          })
      }

      onRowClicked(idTransfo){
        console.log(idTransfo);
        this.etapaService.getEtapasTrafoIndividual(idTransfo).subscribe(res=>{
          this.openDialogEtapaTransfo(res.data)
        })
      }

      compareObjects(o1: any, o2: any): boolean {
        if(o1 && o2 !== null)
        {
          return o1.mes === o2.mes && o1._idMes === o2._idMes;
        }
      }

      applyApiFilter(){
        if(
          (this.form.get('oTeDesde').value || this.form.get('oTeHasta').value) ||
          (this.form.get('oPeDesde').value || this.form.get('oPeHasta').value) ||
          (this.form.get('rangoInicioDesde').value || this.form.get('rangoInicioHasta').value) ||
          (this.form.get('potenciaDesde').value || this.form.get('potenciaHasta').value) ||
          (this.form.get('nucleos').value) || 
          (this.form.get('serieDesde').value) || (this.form.get('serieHasta').value) ||
          (this.form.get('nombreCli').value) ||
          (this.form.get('observaciones').value) ||
          (this.form.get('vendedor').value) ||
          (this.form.get('tTransfo')) ||
          (this.form.get('month').value)
        )
        {
            const otDesde =this.form.get('oTeDesde').value;
            const otHasta =this.form.get('oTeHasta').value;
            const opDesde=this.form.get('oPeDesde').value;
            const opHasta=this.form.get('oPeHasta').value;
            const rgID=this.form.get('rangoInicioDesde').value;
            const rgIH=this.form.get('rangoInicioHasta').value;
            const potDesde=this.form.get('potenciaDesde').value;
            const potHasta=this.form.get('potenciaHasta').value;
            const serieDesde = this.form.get('serieDesde').value;
            const serieHasta = this.form.get('serieHasta').value;
            const nucl=this.form.get('nucleos').value;
            const nC=this.form.get('nombreCli').value;
            const obs = this.form.get('observaciones').value;
            const partialMonth=this.form.get('month').value;
            const vendedor = this.form.get('vendedor').value;
            const tTransfo = this.form.get('tTransfo').value;
            let monthArray=[];
            let yearArray=[];
            if(partialMonth!==null)
            {
              for (let a of partialMonth)
              {
                monthArray.push(a.idMes)
                yearArray.push(a.anio)
              }
            }

            this.oTeDesde = otDesde === null  ? 0 : otDesde;
            this.oTeHasta = otHasta === null ? 0 : otHasta;
            this.oPeDesde = opDesde === null ? 0 : opDesde;
            this.oPeHasta = opHasta === null ? 0 : opHasta;
            this.rangoInicioDesde = rgID === null ? 0 : rgID;
            this.rangoInicioHasta = rgIH === null ? 0 : rgIH;
            this.potenciaDesde = potDesde === null ? 0 : potDesde;
            this.potenciaHasta = potHasta === null ? 0 : potHasta;
            this.serieDesde = serieDesde === null ? 0 : serieDesde;
            this.serieHasta = serieHasta === null ? 0 : serieHasta;
            this.nucleos = nucl === null ? ' ' : nucl;
            this.nombreCli = nC === null ? ' ' : nC;
            this.observaciones = obs === null ? ' ' : obs; 
            this.vendedor = vendedor === null ? ' ' : vendedor;
            this.tTransfo = tTransfo === null ? 0 : tTransfo;
            this.month= partialMonth === null ? [] : monthArray;
            this.year = partialMonth === null ? [] :yearArray;
            

            let filterValue = {
              oTeDesde:this.oTeDesde,
              oTeHasta:this.oTeHasta,
              oPeDesde:this.oPeDesde,
              oPeHasta:this.oPeHasta,
              rangoInicioDesde:this.rangoInicioDesde,
              rangoInicioHasta:this.rangoInicioHasta,
              potenciaDesde:this.potenciaDesde,
              potenciaHasta:this.potenciaHasta,
              serieDesde:this.serieDesde,
              serieHasta:this.serieHasta,
              nucleos:this.nucleos,
              nombreCli:this.nombreCli,
              observaciones:this.observaciones,
              vendedor:this.vendedor,
              tTransfo:this.tTransfo,
              month:this.month,
              year:this.year
            }
            this.openSnackBar("aplicando los filtros seleccionados","buscando")
            if(this.ranges==false){
              this.transformadoresService.getTrafosFilteredWithoutRanges(filterValue).subscribe(res=>{
  
                if(res && res.length>0)
                {
                  this.isLoadingResults=true;
                  this.dataGetTrafos.paginator = this.paginator;
                  
                  // }
                  this.dataGetTrafos.data = res;
                  this.ngZone.onMicrotaskEmpty.pipe(take(3)).subscribe(() => {this.matTable.updateStickyColumnStyles();});
  
  
                  this.openSnackBar("Transformadores encontrados","Exito!")
                }
                else{
                  this.openSnackBar("No existe ningún transformador con el criterio búscado","Advertencia");
                }
              },()=>{},()=>{
                this.isLoadingResults=false;
              });
            }else{
              this.transformadoresService.getTrafosFilter(filterValue).subscribe(res=>{
  
                if(res && res.length>0)
                {
                  this.isLoadingResults=true;
                  this.dataGetTrafos.paginator = this.paginator;
                  
                  // }
                  this.dataGetTrafos.data = res;
                  this.ngZone.onMicrotaskEmpty.pipe(take(3)).subscribe(() => {this.matTable.updateStickyColumnStyles();});
  
  
                  this.openSnackBar("Transformadores encontrados","Exito!")
                }
                else{
                  this.openSnackBar("No existe ningún transformador con el criterio búscado","Advertencia");
                }
              },()=>{},()=>{
                this.isLoadingResults=false;
                this.form.enable()
              });
            }

          }

      }

      clean(){
        this.form.reset();
        this.getTrafos();
      }

      openCheckOT(){
        const dialogRef5 = this.dialog.open(CheckOTDialog,{
          width:'600px'
      
        })
        dialogRef5.afterClosed().subscribe(result => {

        })
      }

      getHistorics(){
      
          this.dataGetTrafos.filter = JSON.stringify(this.historics);
      
      }

      disableRanges(){

        if(this.ranges==false){
          this.form.get('oTeHasta').disable();
          this.form.get('oPeHasta').disable();
          this.form.get('rangoInicioHasta').disable();
          this.form.get('serieHasta').disable();
          this.form.get('potenciaHasta').disable();
        }else{
          this.form.get('oTeHasta').enable();
          this.form.get('oPeHasta').enable();
          this.form.get('rangoInicioHasta').enable();
          this.form.get('serieHasta').enable();
          this.form.get('potenciaHasta').enable();
        }

      }

      formIsNull():boolean{
        let counter:number=0;
        let keys = Object.keys(this.form.value);

        keys.forEach(control=>{
          if(this.form.controls[control].value==null || this.form.controls[control].value==''){
            counter++;
          }
        })
        if(counter==keys.length && this.historics==false) return true
        else return false;
      }






}


interface ComboClientes{
    id:number;
    value:string;
    viewValue:string;
  }

  interface ComboTipoTransfo{
    id:number;
    value:string;
    viewValue:string;
  }


  @Component({
    selector: "alta-transformadores-new",
    templateUrl: "alta-transformadores-new.html",
    styleUrls: ['./transformadores-new.component.css']

  })

  export class AddTransfoComponent{



    form: FormGroup;
    potencia:number;
    oPe:number;
    oTe:number;
    idTransfo:number;
    idCliente:number;
    nombreCli:string;
    idTipoTransfo:number;
    nombreTipoTransfo:string;
    observaciones:string;
    rangoInicio:number;
    checked = false;
    f:Cliente;
    cantidad:number;
    radPan:string;
    serie:number;
    radPanArray=["RN","RI","PN","PI","IS"]
    labelButton:string;
    titulo:string;
    data3: Cliente[] = [];
    comboClientes:ComboClientes[];
    dataTipoTransfo:ComboTipoTransfo[];
    matcher = new MyErrorStateMatcher();
    clientesService: ClienteService;
    selectedCliente: string;
    fechaPactada:Date=new Date();
    fechaProd:Date=new Date();
    fechaCreacion:Date;
    nucleos:string;
    valueTransfo:TipoTransfo;
    filteredOptions: Observable<ComboClientes[]>;
    trafos;
    isFound:boolean=false;
    tipoTransfo=[];
    foundedValue='';
    vendedores:Vendedores[];

    checkedDate=false;
    hide=false;
    fprOlderfot=false;

    //disable some form controls
    disableForms:boolean=false;
    //opNueva
    newOp=false;

    constructor(
      private _snackBar:MatSnackBar,
      private clienteService:ClienteService,
      public dialog:MatDialog,
      private fb: FormBuilder,
      private dialogRefCli: MatDialogRef<CourseDialog3Component>,
      private tipoTransfoService:TipoTransfoService,
      private transformadoresService:TransformadoresService,
      private vendedoresService:VendedoresService,
      private dialogRef: MatDialogRef<AddTransfoComponent>,
      @Inject(MAT_DIALOG_DATA) data1
    ) {
        this.titulo=data1.titulo;
        this.labelButton=data1.labelButton;

    }

    ngOnInit() {
      this.form = this.fb.group({
        potencia:[null,[Validators.required]],
        oPe:[null,[Validators.required]],
        cantidad:[null,[Validators.required]],
        oTe:[null],
        serie:[null],
        idCliente:[null],
        observaciones:[null],
        nombreCli:[null],
        idTipoTransfo:[null,[Validators.required]],
        nombreTipoTransfo:[null],
        valueTransfo:[null],
        f:[null],
        nucleos:[null],
        fechaProd:[this.fechaProd],
        fechaPactada:[this.fechaPactada],
        rangoInicio:[null],
        radPan:[null],
        anio:null,
        mes:null,
        idVendedor:null,
        prioridad:null,
        fechaCreacion:this.fechaCreacion,
        lote:null,
      },);
      this.getClientes();
      this.getTipoTransfo();
      this.getVendedores();

     //filtro
    //  this.filter();
    }

    filter()
    {
      this.filteredOptions = this.form.controls['f'].valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.viewValue),
          map(name => name ? this._filter(name) : this.comboClientes.slice())
        );
    }
    displayFn(comboCli: ComboClientes): string {
      return comboCli && comboCli.viewValue ? comboCli.viewValue : '';
    }

    private _filter(name: string): ComboClientes[] {
      const filterValue = name.toLowerCase();

      return this.comboClientes.filter(option => option.viewValue.toLowerCase().indexOf(filterValue) === 0);
    }

    onBlur(){
      let cantidad=parseInt(this.form.get('cantidad').value);
      let rango=parseInt(this.form.get('rangoInicio').value);
      let op=parseInt(this.form.get('oPe').value)

      this.transformadoresService.getRange(cantidad,op,rango).subscribe(res =>
        {
          if(res!=null)
          {
            this.foundedValue=res;
          }
          else{
            this.foundedValue=''
          }
        }
      );

    }

    newOpe(event:MatCheckboxChange){
      if(event.checked){
        this.form.controls['oPe'].setValue(0);
        this.disableForms=true;
        console.log(this.form.controls);
      }
      else{
        this.disableForms=false;
      }
    }

    selectedClient(event)
    {
      //si elige cliente Stock
      if(event.source.value.id==9999)
      {
        this.form.controls['anio'].setValue(new Date().getFullYear());
        this.form.controls['mes'].setValue(13);
        console.log(this.form.controls['mes']);
      }
      console.log(this.form);
    }

    changeClient(value) {
      return value.id;
    }

    changeTipoTransfo(idTipoTransfo: number, event: any){
      // ignore on deselection of the previous option
      if (event.isUserInput) {    
        //reparaciones
        if(idTipoTransfo==6){
          this.disableForms=true;
          this.form.controls['oPe'].setValue(0);
          this.form.controls['observaciones'].setValidators([Validators.required]);
        }
        else{
          this.disableForms=false;
          this.form.controls['oPe'].setValue(null);
          this.form.controls['observaciones'].clearValidators();
        }
        this.form.controls['observaciones'].updateValueAndValidity();
      }
      console.log(this.form.value)
    }

    saveTrafo() {
      
      console.log(this.form.value);
      let cliente=this.form.controls['f'].value;
      this.form.controls['fechaCreacion'].setValue(new Date());
      if(cliente!=null)
      {
          this.form.controls['idCliente'].setValue(cliente.id);
          this.form.controls['nombreCli'].setValue(cliente.value);
          
      }
        
      //No elige fecha de producción/pactada
      if(this.checkedDate==false)
      {
        this.form.controls['fechaProd'].setValue(new Date());
        this.form.controls['fechaPactada'].setValue(new Date());
        if(cliente!=null)
        {
          if(cliente.id!=9999)
          {
            this.form.controls['anio'].setValue(this.form.controls['fechaProd'].value.getFullYear());
            this.form.controls['mes'].setValue(this.form.controls['fechaProd'].value.getMonth()+1);
          }
        }
        else
        {
          this.form.controls['anio'].setValue(this.form.controls['fechaProd'].value.getFullYear());
          this.form.controls['mes'].setValue(this.form.controls['fechaProd'].value.getMonth()+1);
        }
      }
      else{
        this.form.controls['anio'].setValue(this.form.controls['fechaProd'].value.year());
        this.form.controls['mes'].setValue(this.form.controls['fechaProd'].value.month()+1);
      }
        
        this.form.controls['prioridad'].setValue(1);
        let cantidad=parseInt(this.form.get('cantidad').value);
        if(cantidad > 1){
          var nTransfo = cantidad;
          let arregloTransfo:Transformadores[]=[];
          for (let i = 0; i < nTransfo; i++) {
            arregloTransfo[i]=this.form.value;
            arregloTransfo[i].lote=cantidad;
          }
          console.log("ARREGLO TRANSFOR:",arregloTransfo);
          this.transformadoresService.addTransformadores(arregloTransfo).subscribe(res => {
            this.openSnackBar("Agregando Transformadores","...");
            console.log(res);
          },()=>{},
          ()=>{
            this.openSnackBar("Transformadores agregados!","Exito!");
            this.dialogRefCli.close(true);
          });
          arregloTransfo=[];
        }
        else{
          this.form.controls['lote'].setValue[1];
          this.transformadoresService.addTransformador(this.form.value).subscribe(
            (res) => {
              this.openSnackBar("Transformador agregado", "Exito!");
              this.dialogRefCli.close(true);
            },
            err => {
              this.openSnackBar("No se ha agregado ningún transformador","Error!");
              this.openSnackBar(`${err}`,"Error!")
              console.log(err);
          },)
        }
    }


    getTipoTransfo():void{
        this.tipoTransfoService.getTipoTransfo()
        .subscribe(tipoTransfo => {
          this.tipoTransfo=tipoTransfo;
        });
      }


    close() {
      this.dialogRefCli.close();
    }

    addCliente(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
      id: 1,
      titulo: "Agregar Cliente",
      labelButton:"Agregar"
    };
    // dialogConfig.width= '300px';
    const dialogRef = this.dialog.open(CourseDialog3Component, dialogConfig);

    dialogRef.afterClosed()
    .subscribe(data => {
      console.log(data)
      if (data != undefined) {
        this.onFormSubmit(data);
        setTimeout(()=>{
          this.getClientes();
          this.filter();
        },1000);
      } else {
        //this.getClientes();
      }
    });
    //dialogRef.close();
  }

    getClientes(){
      this.clienteService.getClientes().subscribe((cliente) => {
        this.comboClientes =(cliente.data).map(v => {
          return {id:v.idCliente,value:v.nombreCli,viewValue:v.nombreCli}
        })
      }, err => {
        console.log(err);
      },
      ()=>{
        this.filter();
      })
    }

    getVendedores(){
      this.vendedoresService.getVendedores().subscribe((res)=>{
        this.vendedores = res.data;
      })
    }

    onFormSubmit(form: NgForm){
      console.log(form);
      //this.isLoadingResults = true;
      this.clienteService.addCliente(form).subscribe(
        (res) => {
          console.log(res);

          this.openSnackBar("Cliente agregado","Exito!")
          //this.isLoadingResults = false;

          //this.getClientes();

        },
        err => {
          console.log(err);
          this.openSnackBar(`${err}`,"Eror!")
          //this.isLoadingResults = false;
        }
      );
    }

    changeDate() {
      if(new Date(this.form.controls['fechaProd'].value) > new Date(this.form.controls['fechaPactada'].value))
      {
        this.fprOlderfot=true;
      }
      else{
        this.fprOlderfot=false;
      }
    }

    
    openSnackBar(mensaje1,mensaje2){
        this._snackBar.open(mensaje1,mensaje2, {
          duration: 2 * 1000,
         });
    }


  }

  @Component({
    selector: "editar-transformadores-new",
    templateUrl: "editar-transformadores-new.html",
    styleUrls:["transformadores-new.component.css"]
  })
  export class EditDeleteTransfoComponent{



    form: FormGroup;
    potencia:number;
    oPe:number;
    oTe:number;
    idTransfo:number;
    idCliente:number;
    nombreCli:string;
    observaciones:string;
    anio:number;
    serie:number;
    f:ComboClientes;
    mes:number;
    labelButton:string;
    titulo:string;
    data3: Cliente[] = [];
    tipoTransfo=[];
    comboClientes:ComboClientes[];
    matcher = new MyErrorStateMatcher();
    selectedCliente: string;
    habilitar: boolean;
    cancelado:boolean;
    idTipoTransfo:number;
    nombreTipoTransfo:string;
    valueTransfo:TipoTransfo;
    filteredOptions: Observable<ComboClientes[]>;
    rangoInicio:number;
    rangoFin:number;
    fechaPactada: Date;
    fechaProd: Date;
    nucleos:string;
    prioridad:number;
    lote:number;
    radPan:string;
    idVendedor:number;
    foundedValue='';
    enabled=true;
    vendedores:Vendedores[];
    fprOlderfot=false;

    //no mostrar ope
    notShow=false;

    @Output()
    dateChange:EventEmitter<MatDatepickerInputEvent<any>>;

    constructor(
      private fb: FormBuilder,
      private clienteService:ClienteService,
      public _snackBar:MatSnackBar,
      public dialog:MatDialog,
      private tipoTransfoService:TipoTransfoService,
      private transformadoresService:TransformadoresService,
      private dialogRef: MatDialogRef<EditDeleteTransfoComponent>,
      private vendedoresService:VendedoresService,
      @Inject(MAT_DIALOG_DATA) data1
    ) {
        console.log(data1);
        this.titulo=data1.titulo;
        this.labelButton=data1.labelButton;
        this.idTransfo=data1.idTransfo;
        this.potencia=data1.potencia;
        this.oPe=data1.oPe;
        this.f=data1.idClienteNavigation!=null ? {id:data1.idClienteNavigation.idCliente,value:data1.idClienteNavigation.nombreCli,viewValue:data1.idClienteNavigation.nombreCli} : null;
        this.idTipoTransfo=data1.idTipoTransfo;
        this.oTe=data1.oTe;
        this.idCliente=data1.idCliente;
        this.nombreCli=data1.nombreCli;
        this.observaciones=data1.observaciones;
        this.anio=data1.anio;
        this.serie=data1.serie;
        this.mes=data1.mes;
        this.rangoInicio=data1.rangoInicio;
        this.rangoFin=data1.rangoFin;
        this.fechaPactada=data1.fechaPactada;
        this.fechaProd=data1.fechaProd;
        this.nucleos=data1.nucleos;
        this.prioridad=data1.prioridad;
        this.lote=data1.lote;
        this.radPan=data1.radPan;
        this.idVendedor=data1.idVendedor;
    }




    ngOnInit() {
      this.form = this.fb.group({
        idTransfo:[this.idTransfo],
        potencia:[this.potencia,[Validators.required]],
        oPe:[this.oPe,[Validators.required]],
        oTe:[this.oTe],
        idCliente:[this.idCliente],
        idTipoTransfo:[this.idTipoTransfo],
        observaciones:[this.observaciones],
        nombreCli:[this.nombreCli],
        f:[this.f],
        serie:[this.serie],
        cancelado:[this.cancelado],
        mes:[this.mes],
        anio:[this.anio],
        rangoInicio:[this.rangoInicio],
        rangoFin:[this.rangoFin],
        fechaProd:[this.fechaProd],
        fechaPactada:[this.fechaPactada],
        nucleos:[this.nucleos],
        prioridad:[this.prioridad],
        lote:[this.lote],
        radPan:[this.radPan],
        idVendedor:[this.idVendedor]
      });
      if(this.oPe==0)
      {
        this.notShow=true;
      }



      this.getClientes();
      this.getTipoTransfo();

      this.getVendedores();



      //this.form.controls['f'].setValue({id:this.f.idCliente,value:this.f.nombreCli,viewValue:this.f.nombreCli})

      this.disabling();
    }

     //filtro
     filter(){
       if(this.comboClientes!=undefined)
       {
         this.filteredOptions = this.form.controls['f'].valueChanges
         .pipe(
           startWith(''),
           map(value => typeof value === 'string' ? value : value.viewValue),
           map(name => name ? this._filter(name) : this.comboClientes.slice())
         );
       }
     }

    disabling(){
      if(this.labelButton=="Borrar"){
        this.form.disable();
        
      }
    }

    displayFn(comboCli: ComboClientes): string {

          return comboCli && comboCli.viewValue ? comboCli.viewValue : '';
      }

    private _filter(name: string): ComboClientes[] {
      const filterValue = name.toLowerCase();

      return this.comboClientes.filter(option => option.viewValue.toLowerCase().indexOf(filterValue) === 0);
    }

    getTipoTransfo():void{
      this.tipoTransfoService.getTipoTransfo()
      .subscribe(tipoTransfo => {
        this.tipoTransfo=tipoTransfo;
      });
    }

    onBlur(){
      let idTransfo=parseInt(this.form.get('idTransfo').value);
      let rango=parseInt(this.form.get('rangoInicio').value);
      let op=parseInt(this.form.get('oPe').value)

      this.transformadoresService.getRangeOnPut(idTransfo,op,rango).subscribe(res =>
        {
          if(res!=null)
          {
            this.foundedValue=res;
            this.enabled=false;
          }
          else{
            this.foundedValue='';
            this.enabled=true;
          }
        }
      );

    }

    getClientes(){
        this.clienteService.getClientes().subscribe(cliente => {
          this.comboClientes =(cliente.data).map(v => {
            return {id:v.idCliente,value:v.nombreCli,viewValue:v.nombreCli}
          })
        }, err => {
          console.log(err);
        },
        ()=>{
          this.filter();
        }
        )
      }
      getVendedores(){
        this.vendedoresService.getVendedores().subscribe((res)=>{
          this.vendedores = res.data;
        })
      }

      onFormSubmit(form: NgForm){
        console.log(form);
        //this.isLoadingResults = true;
        this.clienteService.addCliente(form).subscribe(
          (res) => {
            console.log(res);
  
            this.openSnackBar("Cliente agregado","Exito!")
            //this.isLoadingResults = false;
  
            //this.getClientes();
  
          },
          err => {
            console.log(err);
            this.openSnackBar(`${err}`,"Eror!")
            //this.isLoadingResults = false;
          }
        );
      }
  
    

    changeDate(event,bool){
      // if(bool==true)
      // {
      //   this.form.controls['mes'].setValue((event.value.month())+1);
      //   this.form.controls['anio'].setValue(event.value.year());
        
      // }
      if(new Date(this.form.controls['fechaProd'].value) > new Date(this.form.controls['fechaPactada'].value))
      {
        this.fprOlderfot=true;
      }
      else{
        this.fprOlderfot=false;
      }

    }

    addCliente(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
      id: 1,
      titulo: "Agregar Cliente",
      labelButton:"Agregar"
    };
    // dialogConfig.width= '300px';
    const dialogRef = this.dialog.open(CourseDialog3Component, dialogConfig);

    dialogRef.afterClosed()
    .subscribe(data => {
      console.log(data)
      if (data != undefined) {
        this.onFormSubmit(data);
        setTimeout(()=>{
          this.getClientes();
          this.filter();
        },1000);
      } else {
        //this.getClientes();
      }
    });
    //dialogRef.close();
  }

  openSnackBar(mensaje1,mensaje2){
    this._snackBar.open(mensaje1,mensaje2, {
      duration: 2 * 1000,
     });
}

    save() {

      if(this.labelButton=="Borrar")
      {
        this.transformadoresService.deleteTransformador(this.form.controls['idTransfo'].value).subscribe(res => console.log(res))
      }
      else{
        if(this.form.controls['f'].value)
        {
          let cliente=this.form.controls['f'].value;
          this.form.controls['idCliente'].setValue(cliente.id);
          this.form.controls['nombreCli'].setValue(cliente.value);
        }
        this.transformadoresService.updateTransformador(this.form.controls['idTransfo'].value,this.form.value).subscribe(res=>console.log(res));
      }



    }


    close() {
      this.dialogRef.close();
    }

  }

  @Component({
    selector: "info-etapa-transformadores-new",
    templateUrl: "info-etapa-transformadores-new.html",
    styles: ['table{ width:100%}']
  })
  export class ShowInfoNewComponent{
    displayedColumns: string[] = ['proceso','refProceso','fechaIni','fechaFin','tiempo','Empleados','lastUserModif','dateLastModif'];
    dataEtapaPorTransfo:any[]=[];
    nombreEtapa:string;
    dateIni:Date;
    dateFin:Date;
    tiempoParc:string;
    tiempoFin:string;
    displayedColumns2:string[]=[
      'prioridad',
      'oTe', 
      'nucleos',
      'radPan',
      'oPe',
      'rangoInicio',
      'lote',
      'potencia',
      'fechaPactada',
      'nombreCli',
      'fechaProd',
      'observaciones'
    ]


    constructor(private dialogRef: MatDialogRef<ShowInfoNewComponent>,
      @Inject(MAT_DIALOG_DATA) data1)
      {

          console.log(data1);
          this.dataEtapaPorTransfo=data1;
      }

      ngOnInit(){
        this.dataEtapaPorTransfo;
      }

      onNoClick(): void {
        this.dialogRef.close();
      }




  }

  @Component({
    selector: "editar-todos-transformadores-new",
    templateUrl: "editar-todos-transformadores-new.html",
    styleUrls:['transformadores-new.component.css']
  })
  export class EditAllTrafosNewComponent{



    form: FormGroup;
    potencia:number;
    oPe:string;
    oTe:number;
    idTransfo:number;
    idCliente:number;
    nombreCli:string;
    observaciones:string;
    anio:number;
    f:Cliente;
    serie:number;
    mes:number;
    labelButton:string;
    titulo:string;
    data3: Cliente[] = [];
    diego2:Cliente[];
    matcher = new MyErrorStateMatcher();
    selectedCliente: string;
    habilitar: boolean;
    cancelado:boolean;
    idTipoTransfo:number;
    nombreTipoTransfo:string;
    dataTipoTransfo:ComboTipoTransfo[];
    valueTransfo:TipoTransfo;
    filteredOptions: Observable<Cliente[]>;
    rangoInicio:number;
    rangoFin:number;
    fechaPactada: Date;
    fechaProd: Date;
    nucleos:string;
    prioridad:number;
    lote:number;
    radPan:string;
    selectedValue: string;
    dataTrafos:MatTableDataSource<any>;
    isLoadingResults=true;
    trafosToModify=null;
    colores:Colores[]=[];
    colorSelected:Colores=null;
    tipoEtapas:TipoEtapa[]=[];
    tipoEtapa=new FormControl();
    idVendedor:number;
    vendedores : Vendedores[];
    etapaObs:string;

    options: any[] = [
      {value: '0', viewValue: 'editar datos de cabecera'},
      {value: '1', viewValue: 'editar datos de procesos'}
    ];

    @Output()
    dateChange:EventEmitter< MatDatepickerInputEvent<any>>;



    constructor(
      private tipoEtapaService:TipoEtapaService,
      private coloresService:ColoresService,
      private clientesService:ClienteService,
      public dialog:MatDialog,
      private fb: FormBuilder,
      private _snackBar:MatSnackBar,
      private dialogRef: MatDialogRef<EditAllTrafosNewComponent>,
      private vendedoresService:VendedoresService,
      @Inject(MAT_DIALOG_DATA) data1
    ) {
        this.titulo=data1.titulo;
        this.labelButton=data1.labelButton;
        this.trafosToModify=data1.trafosToModify;
        this.dataTipoTransfo=data1.dataTipoTransfo;
        this.colores=data1.colores;


    }




    ngOnInit() {
      this.form = this.fb.group({
        oPe:[this.oPe],
        oTe:[this.oTe],
        potencia:[this.potencia],
        idTipoTransfo:[this.idTipoTransfo],
        f:[this.f],
        radPan:[this.radPan],
        nucleos:[this.nucleos],
        observaciones:[this.observaciones],
        serie:[this.serie],
        nombreCli:[this.nombreCli],
        fechaPactada:[this.fechaPactada],
        fechaProd:[this.fechaProd],
        anio:[this.anio],
        mes:[this.mes],
        lote:[this.lote],
        idVendedor:[this.idVendedor]

      })
      this.getclientes();
      this.getColores();
      this.getTipoEtapas();
      this.getVendedores();
      this.filter();

    }

    getColores(){
      this.coloresService.getColores().subscribe(res => {
        this.colores=res;
        if(localStorage.getItem("idTipoUs")=='5' || localStorage.getItem("idTipoUs")=='4')
        { 
          this.colores=this.colores.filter((x)=>{
            return x.idColor==10 || x.idColor==1032 || x.idColor==1040;
          });
        }
        let referenceNull:Colores = {
          idColor:100000,
          codigoColor:"#ffffff",
          leyenda:"Quitar referencia actual"
        };
        this.colores.push(referenceNull);
      })
    }

    getclientes(){
      this.clientesService.getClientes().subscribe(res => {
        this.diego2=res.data;
      })
    }

    getTipoEtapas(){
      let sector = localStorage.getItem("sector");
      this.tipoEtapaService.getTipoEtapaBySector(parseInt(sector)).subscribe(res => {
        if(localStorage.getItem("idTipoUs")=="4" || localStorage.getItem("idTipoUs") =="5"){
          res.data=res.data.filter((x)=>{ return x.idTipoEtapa==45})
        } 
        this.tipoEtapas = res.data;
      })
    }

    getVendedores(){
      this.vendedoresService.getVendedores().subscribe(res => {
        this.vendedores = res.data;
      })
    }

    filter()
    {
      this.filteredOptions = this.form.controls['f'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.viewValue),
        map(name => name ? this._filter(name) : this.diego2.slice())
      );
    }
    displayFn(comboCli: Cliente): string {
      return comboCli && comboCli.nombreCli ? comboCli.nombreCli : '';
    }

    private _filter(name: string): Cliente[] {
      const filterValue = name.toLowerCase();

      return this.diego2.filter(option => option.nombreCli.toLowerCase().indexOf(filterValue) === 0);
    }

    changeDate(event){

      // this.form.controls['mes'].setValue((event.value.month())+1);
      // this.form.controls['anio'].setValue(event.value.year());

    }

    nombreEtapas(etapa:string)
    {
      let et =
      {
        "DOC":"Documentación",
        "BT1":"Bob BT",
        "BT2":"Bob BT",
        "BT3":"Bob BT",
        "AT1":"Bob AT",
        "AT2":"Bob AT",
        "AT3":"Bob AT",
        "RG1":"Bob RG",
        "RG2":"Bob RG",
        "RG3":"Bob RG",
        "RF1":"Bob RF",
        "RF2":"Bob RF",
        "RF3":"Bob RF",
        // "ENS":"Ensamblaje Bobinas",
        "PY CYP":"C Y P PYS",
        "PY SOL":"Soldadura Prensayugos",
        "PY ENV":"Envio de PYS",
        "NUC":"Nucleo",
        "MON":"Montaje",
        "HOR":"Horno",
        "CUBA CYP":"C Y P Tapa-Cuba",
        "SOL \n TAPA":"TAPA",
        "RAD \n PAN":"Radiadores o Paneles",
        "CUBA":"Cuba",
        "HERM":"Hermeticidad",
        "GRAN":"Granallado",
        "PINT":"Pintura",
        "ENC":"Encubado",
        "LAB":"Ensayos(Ref)",
        "TERM":"Terminacion",
        "APR":"Aprobacion",
        "ENV":"Envío a cliente",
        "CYP PAT":"C Y P PATAS",
        "PAT ENV":"ENVIO PATAS",
        "CON BT":"CONEXION BT",
        "CON AT":"CONEXION AT",
        "REL \n TRA":"RELACION DE TRANSFORMACION",
        "SOL \n CUBA":"SOLDADURA CUBA",
        "GRAN \n CUBA":"GRANALLADO CUBA",
        "PINT \n CUBA":"PINTURA CUBA",
        "ENV \n CUBA":"ENVIO CUBA",
        "CYP \n TAPA":"C Y P TAPA",
        "GRAN \n TAPA":"GRANALLADO TAPA",
        "PINT \n TAPA":"PINTURA TAPA",
        "ENV \n TAPA":"ENVIO TAPA",
        "CUBI":"CUBIERTA",
        "CH \n CAR":"Chapa de características",
      }
      return et[etapa];
    }

    onFormSubmit(form: NgForm){
      console.log(form);
      //this.isLoadingResults = true;
      this.clientesService.addCliente(form).subscribe(
        (res) => {
          console.log(res);

          this.openSnackBar("Cliente agregado","Exito!")
          //this.isLoadingResults = false;

          //this.getClientes();

        },
        err => {
          console.log(err);
          this.openSnackBar(`${err}`,"Eror!")
          //this.isLoadingResults = false;
        }
      );
    }

    addCliente(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
      id: 1,
      titulo: "Agregar Cliente",
      labelButton:"Agregar"
    };
    // dialogConfig.width= '300px';
    const dialogRef = this.dialog.open(CourseDialog3Component, dialogConfig);

    dialogRef.afterClosed()
    .subscribe(data => {
      console.log(data)
      if (data != undefined) {
        this.onFormSubmit(data);
        setTimeout(()=>{
          this.getclientes();
          this.filter();
        },1000);
      } else {
        //this.getClientes();
      }
    });
    //dialogRef.close();
  }

    save() {
      if(this.selectedValue=='0'){
        console.log(this.form.value)
       this.dialogRef.close(this.form.value)
      }
      else{
        console.log(this.colorSelected);
        let arrayTrafos=[];
        for(let trafo of this.trafosToModify)
        {
          arrayTrafos.push(trafo.idTransfo);
        }
        let obj ={
          ArrayTrafo:arrayTrafos,
          IdTipoEtapa:this.tipoEtapa.value,
          IdRef:this.colorSelected,
          observacion:this.etapaObs
        }
        this.dialogRef.close(obj)
      }
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    openSnackBar(mensaje1,mensaje2){
      this._snackBar.open(mensaje1,mensaje2, {
        duration: 2 * 1000,
       });
  }

  }

  @Component({
    selector: "delete-all-transfo",
    templateUrl: "delete-all-transfo.html",
    styleUrls:["transformadores-new.component.css"]
  })
  export class DeleteAllTransfoDialog{
    titulo="";
    labelButton="";
    header="";
    transfoArray=[];
    idTransfoArray=[];
    constructor(private transformadoresService:TransformadoresService,
    private dialogRef: MatDialogRef<DeleteAllTransfoDialog>,public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data1
  ) {
      console.log(data1);
      this.titulo=data1.titulo;
      this.labelButton=data1.labelButton;
      this.transfoArray=data1.trafosToDelete;
      this.header=data1.header;
      for(let trafo of this.transfoArray)
      {
        this.idTransfoArray.push(trafo.idTransfo);
      }
    }

    deleteTrafos()
    {
      this.transformadoresService.deleteAllTrafos(this.idTransfoArray).subscribe(res=>
        {
          if(res.status==409){
            let data={
              titulo:"Confirmar borrado",
              labelButton:"Confirmar",
              header:`${res.message} ¿Desea continuar de todos modos?`,
              trafosToDelete:this.transfoArray
            }
            // this.dialog.open(DeleteAllTransfoDialog,{
            //   data:data}
            // )
            const dialogRef3 = this.dialog.open(DeleteAllTransfoDialog, {
              data:data
            });

          }
          if(res.status==200)
          {
            this.dialog.closeAll();
          }
        }
      );
    }

    confirmDeleteTrafos(){
      this.transformadoresService.confirmDeleteAllTrafos(this.idTransfoArray).subscribe(res=>{
        console.log(res);
        if(res.status==200)
        {
          this.dialog.closeAll();
        }
      })
    }
  }

  @Component({
    selector: "checkOT",
    templateUrl: "checkOT.html",
    styleUrls:["transformadores-new.component.css"]
  })
  export class CheckOTDialog implements OnInit{
      data:MatTableDataSource<any>=new MatTableDataSource<any>();
      displayedColumns=['desde','hasta'];
      inputDesde:number;
      inputHasta:number;
      messageError:string;

      constructor(private transformadoresService:TransformadoresService,public _snackBar:MatSnackBar){

      }
      ngOnInit(){
        this.transformadoresService.checkOT(0,0).subscribe(res => {
          console.log(res);
          if(res.status==200)
          {
            this.data.data=res.data;
          }
          else{
            this.openSnackBar(`${res.message}`,"Error!")
          }
        })
      }

      openSnackBar(mensaje1,mensaje2){
        this._snackBar.open(mensaje1,mensaje2, {
          duration: 2 * 1000,
         });
      }
      applyFilter(event: number) {
        if(this.inputDesde>999){
          
          if(this.inputHasta>999)
          {
            this.messageError="";
            this.transformadoresService.checkOT(this.inputDesde,this.inputHasta).subscribe(res=>{
              if(res.status==200){
                this.data.data=res.data;
              }
              else{
                this.openSnackBar(`${res.message}`,"Error!")
              }
            })
          }
          else if(this.inputHasta>0){
            this.messageError="Debe elegir valores mayores a 999"
          }
          else{
            this.messageError="";
            this.transformadoresService.checkOT(this.inputDesde,0).subscribe(res=>{
              if(res.status==200){
                this.data.data=res.data;
              }
              else{
                this.openSnackBar(`${res.message}`,"Error!")
              }
            })
          }
        }
        else{
          this.messageError="Debe elegir valores mayores a 999"

        }
        // const filterValue = (event.target as HTMLInputElement).value;
        // this.data.filter = filterValue.trim().toLowerCase();
    
        // if (this.data.paginator) {
        //   this.data.paginator.firstPage();
        // }
      }
  }


  export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(
      control: FormControl | null,
      form: FormGroupDirective | NgForm | null
    ): boolean {
      const isSubmitted = form && form.submitted;
      return !!(
        control &&
        control.invalid &&
        (control.dirty || control.touched || isSubmitted)
      );
    }
  }