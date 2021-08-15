import { Component, OnInit,ViewChild, Input, Output,EventEmitter, NgZone, ElementRef } from '@angular/core';
import { TransformadoresService } from '../services/transformadores.service';
import {MatTableDataSource, MatTable} from '@angular/material/table';
import { Transformadores } from '../models/transformadores';
import {MatSort} from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Etapa } from '../models/etapa';
import { EmpleadoService } from '../services/empleado.service';
import { EtapaService } from '../services/etapa.service';
import { take } from 'rxjs/operators';
import { MatPaginator } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';


let MAP_NOMBRE_ETAPA:{[tipoEtapa:string]:number}={
  
};


interface Mes {
  value: number;
  viewValue: string;
}


@Component({
  selector: 'etapa-column-component2',
  template: `
  <ng-container *ngIf="etapa">
    <div style="height:61px; line-height:61px" [style.border-left]="(etapa.idTipoEtapa==2 || etapa.idTipoEtapa==5 || etapa.idTipoEtapa==8 || etapa.idTipoEtapa==11|| etapa.idTipoEtapa==14) ? '2px solid rgba(56,56,56,0.60)' : ((etapa.idTipoEtapa==1) ? '2.5px solid rgb(56,56,56)': '0')" [style.background-color] = "etapa.idColorNavigation ? etapa.idColorNavigation.codigoColor : 'white'" [matTooltip]="etapa.idColorNavigation ? etapa.idColorNavigation.leyenda : '' ">
      <span *ngIf="etapa.dateIni" (click)=select(etapa)>{{etapa.numEtapa}}</span>
      <button mat-icon-button style="float:right;" *ngIf="!etapa.dateIni" (click)=select(etapa)><mat-icon>done</mat-icon></button>
    </div>
  </ng-container>
  `,
  styleUrls: ['./timer-reloaded.component.css']
})
export class EtapaColumnComponent2{
  //Proceso simple
  @Input() etapa:Etapa;
  @Output() procesoSelected=new EventEmitter<Etapa>();
  
  array=new Array();

  constructor(){
    
  }

  select(row){
    
    this.procesoSelected.emit(row);

  }



}


@Component({
  selector: 'app-timer-reloaded',
  templateUrl: './timer-reloaded.component.html',
  styleUrls: ['./timer-reloaded.component.css']
})
export class TimerReloadedComponent implements OnInit {

  showMulti=true;

  trafoSelected
  dataGetTrafos:MatTableDataSource<any>;
  isLoadingResults=true;
  displayedColumns1:string[]=['select']
  displayedColumns2:string[]=[
    'oTe',
    'oPe',
    'rangoInicio',
    'potencia'
  ]

  //esto es una forma cheta de obtener el array con los nombres de las columnas que machean con el "nombreTipoEtapa".
  //etapasColumns: string[]= Object.keys(MAP_NOMBRE_ETAPA);
  etapasColumns:string[]=Object.keys(this.activatedRoute.snapshot.data['MAP_NOMBRE_ETAPA']);
  
  //etapasColumns:string[]=[];
  
  // TODAS las columnas
  allColumns: string[]= this.displayedColumns1.concat(this.displayedColumns2).concat(this.etapasColumns);
  dataSource;
  etapasActualizadas:boolean;
  numRef:number=0;
  durationInSeconds=3;
  procesoElegido:Object;
  selectedProceso=false;
  timers : string[] = []
  contador=0;
  show=false;
  sendProcess=false;
  selectColumn=false;

  selection = new SelectionModel<any>(true, []);

  form=new FormGroup(
    {
      oTe:new FormControl(),	
      oPe	:new FormControl(),
      rangoInicio	:new FormControl(),
      potencia:new FormControl(),
      nProceso: new FormControl(),
      month:new FormControl()
    }
  )

  oTe= '';
  oPe= '';
  rangoInicio= '';
  nProceso= '';
  potencia='';
  month=[];
  year=[]

  pageNumber:number=1;



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
    {value:12,viewValue:"Diciembre"}
  ].sort((a,b)=>{
    if (a.value - b.value)
    return -1;
    if (b.value - b.value )
    return 1;
    return 0;
  });

  //variable para los meses
  months=null;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, { static: false }) matTable: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private activatedRoute: ActivatedRoute,private ngZone: NgZone,private etapaService:EtapaService,private empleadoService:EmpleadoService,private transformadoresService:TransformadoresService,private route: ActivatedRoute,private _snackBar: MatSnackBar) {
    
   }

  ngOnInit(): void {
    MAP_NOMBRE_ETAPA= this.activatedRoute.snapshot.data['MAP_NOMBRE_ETAPA'];
    
    this.dataGetTrafos=new MatTableDataSource();
    this.getTrafos();
    this.getMonthYear();
    setTimeout(()=>{
      this.getTrafos();
    },300000)
  }

 

  



  

  encabezadosTrafo(trafo:string){
    switch(trafo)
    {
      case "oTe": 
          trafo="OT"
          break;
      case'oPe':
          trafo="OP"
          break;
      case'rangoInicio':
          trafo="RNG"
          break;
      case'potencia':
          trafo="POT"
          break;    
    }
    return trafo;
  }


  tooltipTrafo(trafo:string){
    switch(trafo)
    {
      case "oTe": 
          trafo="OT"
          break;
      case'oPe':
          trafo="OP"
          break;
      case'rangoInicio':
          trafo="Rango"
          break;
      case'potencia':
          trafo="Potencia"
          break;    
    }
    return trafo;
  }

  toolTipEtapas(etapa:string)
  {
    switch(etapa)
    {
      case "DOC":
        etapa="Documentación";
        break;
      case "BT1":
        etapa="Bob BT";
        break;
      case "BT2":
        etapa="Bob BT";
        break;
      case "BT3":
        etapa="Bob BT";
        break;
      case "AT1":
        etapa="Bob AT";
        break;
      case "AT2":
        etapa="Bob AT";
        break;
      case "AT3":
        etapa="Bob AT";
        break;
      case "RG1":
        etapa="Bob RG";
        break;
      case "RG2":
        etapa="Bob RG";
        break;
      case "RG3":
        etapa="Bob RG";
        break;
      case "RF1":
        etapa="Bob RF";
        break;
      case "RF2":
        etapa="Bob RF";
        break;
      case "RF3":
        etapa="Bob RF";
        break;
      case "ENS":
        etapa="Ensamblaje Bobinas";
        break;
      case "PY CYP":
        etapa="C Y P PYS";
        break;
      case "PY SOL":
        etapa="Soldadura Prensayugos";
        break;
      case "PY ENV":
        etapa="Envio de PYS";
        break;
      case "NUC":
        etapa="Nucleo";
        break;
      case "MON":
        etapa="Montaje";
        break;
      case "HOR":
        etapa="Horno";
        break;
      case "CUBA CYP":
        etapa="C Y P Tapa-Cuba";
        break;
      case "TAPA":
        etapa="TAPA";
        break;
      case "RAD/PAN":
        etapa="Radiadores o Paneles";
        break;
      case "CUBA":
        etapa="Cuba";
        break;
      case "TINT":
        etapa="Tintas penetrantes";
        break;
      case "GRAN":
        etapa="Granallado";
        break;
      case "PINT":
        etapa="Pintura";
        break;
      case "ENC":
        etapa="Encubado";
        break;
      case "LAB":
        etapa="Ensayos(Ref)";
        break;
      case "TERM":
        etapa="Terminacion";
        break;
      case "DEP":
        etapa="Envio a depósito";
        break;
      case "ENV":
        etapa="Envío a cliente";
        break;
    }
    return etapa;
  }

  getTrafos():void{
    this.openSnackBar("Cargando Información","...");
    if(!Object.values(this.form.value).some(x => x !== null && x !== ''))
    {
      this.transformadoresService.GetTrafosByPageProcess(this.pageNumber).subscribe(transfo=>{
        console.log(transfo);
        this.isLoadingResults = true;
        this.dataGetTrafos.paginator = this.paginator;
        let transfoArray=[];
        for (let a of transfo)
        {
          let group={group : `${a.mes} de ${a.anio}. Tot:${a.trafos.length}`}
          transfoArray.push(group);
          for(let b of a.trafos)
          {
            transfoArray.push(b);
          }
        this.dataGetTrafos.data=transfoArray;
        }
        
      }, err => {
          this.isLoadingResults = false;
      },
        () =>{
          this.ngZone.onMicrotaskEmpty.pipe(take(4)).subscribe(() => {this.matTable.updateStickyColumnStyles();});
          this.isLoadingResults=false;
          this.openSnackBar("Información cargada","Exito!")
      });
    }else{
      this.applyApiFilter();
    }


  }

  compareObjects(o1: any, o2: any): boolean {
    if(o1 && o2 !== null)
    {
      return o1.mes === o2.mes && o1._idMes === o2._idMes;
    }
  }

  getMonthYear(){
    this.transformadoresService.getMonthYear().subscribe(res=>{
      this.months=res;
    })
  }

  moveUp(){
    window.scrollTo(0,0);
  }

  showOrHide(){
    this.selectColumn=!this.selectColumn;
    if(this.selectColumn==true)
    {
      this.openSnackBar(`Elija los transformadores y luego presione el botón ${String.fromCodePoint(0x270F)}` ,"atención!")
    }
    
    
  }

  multiProcess(){
    if(this.selection.selected.length>1)
    {
      this.openSnackBar("Transformadores elegidos","Exito!");
      this.trafoSelected=this.selection.selected;
    }

    
  }

  sendProc(){
    this.sendProcess=!this.sendProcess;
  }

  //Obtiene la etapa de un transformador en base al nombre de la etapa
  getEtapa(t:Transformadores, nombreEtapa: string): any {
    let matchEtapa = t.etapa.filter(etapa => etapa.idTipoEtapa == MAP_NOMBRE_ETAPA[nombreEtapa]);
    
    if(matchEtapa.length!=0)
    {
      
      return matchEtapa[0];
    }
    if(this.etapasActualizadas==true)
    {
      this.getTrafos();
    }
  }

  selected(evento){
    
    
    this.openSnackBar("Proceso seleccionado!","mensaje")
    this.selectedProceso=true;
    this.procesoElegido=evento;
    console.log(this.procesoElegido);
      this.contador++;
      this.timers.push('Timer' + this.contador) 

  }



  numeroEtapa(row){
    console.log(row);
  }

  
  procesoUpdated(evento){
    if(evento==true)
    {
      this.getTrafos();
    }
  }

  multiProcessUpdated(evento){
    if(evento==true)
    {
        this.getTrafos();
    }
  }

  multiProcessFinished(event){
    if(event == true)
    {
      this.getTrafos();
    }
    this.trafoSelected=null;
    this.selection = new SelectionModel<any>(true, []);
  }

  isGroup(index, item): boolean{
    return item.group;
  }

  openSnackBar(mensaje1,mensaje2) {
    this._snackBar.open(mensaje1,mensaje2, {
       duration: this.durationInSeconds * 1000,
      });
  }



  

  applyApiFilter(){
    if(
      (this.form.get('oTe').value && this.form.get('oTe').value.length>3)||
      (this.form.get('oPe').value && this.form.get('oPe').value.length>3) ||
      (this.form.get('rangoInicio').value && this.form.get('rangoInicio').value.length>=2) ||
      (this.form.get('potencia').value && this.form.get('potencia').value.length>=3) ||
      (this.form.get('month').value) ||
      (this.form.get('nProceso').value)
    )
    {
        const ot =this.form.get('oTe').value;
        const op=this.form.get('oPe').value;
        const rI=this.form.get('rangoInicio').value;
        const pot=this.form.get('potencia').value;
        const nProc=this.form.get('nProceso').value;
        // const month=this.form.get('month').value;
        const partialMonth=this.form.get('month').value;
        
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
        
        this.oTe = ot === null ? ' ' : ot;
        this.oPe = op === null ? ' ' : op;
        this.rangoInicio = rI === null ? ' ' : rI;
        this.potencia = pot === null ? ' ' : pot;
        this.nProceso = nProc === null ? ' ' : nProc;
        // this.month= month === null ? ' ' : month;
        this.month= partialMonth === null ? [] : monthArray;
        this.year = partialMonth === null ? [] : yearArray;

        let filterValue = {
          oTe :this.oTe,
          oPe:this.oPe,
          rangoInicio:this.rangoInicio,
          potencia:this.potencia,
          month:this.month,
          year:this.year,
          nProceso:this.nProceso
        }
        this.openSnackBar("aplicando los filtros seleccionados","buscando")
        this.transformadoresService.getTrafosFilterProcess(filterValue).subscribe(res=>{
          console.log(res)
          if(res && res.length>0)
          {
            this.isLoadingResults=true;
            this.dataGetTrafos.paginator = this.paginator;
            let transfoArray=[];
            for (let a of res)
            {
              let group={group : `${a.mes} de ${a.anio}. Tot:${a.trafos.length}`}
              transfoArray.push(group);
              for(let b of a.trafos)
              {
                transfoArray.push(b);
              }
              this.dataGetTrafos.data=transfoArray;
            }
            this.openSnackBar("Transformadores encontrados","Exito!");
          }
          else{
            this.openSnackBar("No existe ningún transformador con el criterio buscado","Advertencia");
          }
        },()=>{},()=>{
          this.isLoadingResults=false;
        });

      }

  }

  clean(){
    this.form.reset();
    this.getTrafos();
  }


}
