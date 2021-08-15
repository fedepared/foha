import { Component, OnInit, Inject,ViewChild, Input, Output,EventEmitter, NgZone } from '@angular/core';
import { Transformadores } from '../models/transformadores';
import { TransformadoresService } from '../services/transformadores.service';
import { ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
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
import { Observable, forkJoin, timer } from 'rxjs';
import { tap, take, mergeMap, filter } from 'rxjs/operators';
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
import { MatDatepickerInputEvent, MatPaginator } from '@angular/material';
import { CourseDialog3Component } from '../clientes/clientes.component';
import { Transform } from 'stream';
import { TmplAstRecursiveVisitor } from '@angular/compiler';
import { SelectionModel } from '@angular/cdk/collections';

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
        "ENS":14,
        "PY CYP":15,
        "PY SOL":16,
        "PY ENV":17,
        "NUC":18,
        "MON":19,
        "HOR":20,
        "CUBA CYP":21,
        "TAPA":22,
        "RAD/PAN":23,
        "CUBA":24,
        "TINT":25,
        "GRAN":26,
        "PINT":27,
        "ENC":28,
        "LAB":29,
        "TERM":30,
        "DEP":31,
        "ENV":32
}


interface Mes {
  value: number;
  viewValue: string;
}
  

@Component({
  selector: 'etapa-column-component',
  template: `
  <ng-container *ngIf="etapa">
    <div style="height:64px;line-height:64px" [style.border-left]="(etapa.idTipoEtapa==2 || etapa.idTipoEtapa==5 || etapa.idTipoEtapa==8 || etapa.idTipoEtapa==11|| etapa.idTipoEtapa==14) ? '2px solid rgba(56,56,56,0.60)' : ((etapa.idTipoEtapa==1) ? '2.5px solid rgb(56,56,56)': '0')" [style.background-color] = "etapa.idColorNavigation ? etapa.idColorNavigation.codigoColor : 'white'" [matTooltip]="etapa.idColorNavigation ? etapa.idColorNavigation.leyenda : '' ">
      <span style="padding-left:10px;" *ngIf="(etapa.tiempoParc)!='Finalizada' && (etapa.tiempoParc)!=null" ></span>
      <span style="display:inline;margin:0;width:24px;height:24px;">
        <button mat-icon-button *ngIf="etapa.dateIni==null || etapa.dateFin!==null" style="line-height:64px;width:24px;height:24px;" (click)=asignarRef(etapa) matTooltipPosition="above"  matTooltip="Asignar referencia"><mat-icon>done</mat-icon></button>
      </span>
    </div>
  </ng-container>
  `,
  
  styleUrls: ['./transformadores-reloaded.component.css']
})
export class EtapaColumnComponent{
  coloresArr:Colores[]=[];
  etapaSelected:Etapa;

  @Input() etapa:Etapa; actualizar:Boolean;
  @Output() actualizado=new EventEmitter<Boolean>();
  
  
  
  constructor(private coloresService:ColoresService,public dialog: MatDialog){}
  
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
    const dialogRef = this.dialog.open(AssignColorComponent, dialogConfig);
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
  
  
}

@Component({
  selector: "asignar-colores",
  templateUrl: "asignar-colores.html"
})
export class AssignColorComponent{
  etapaSelected:Etapa;
  coloresArr:Colores[];
  data:MatTableDataSource<Colores>;
  displayedColumns:string[]=['select','color','leyenda']
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private dialogRef: MatDialogRef<AssignColorComponent>,private coloresService:ColoresService,public dialog: MatDialog,private etapaService:EtapaService,
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
      let blanco:Colores={idColor:999999,codigoColor:"#ffffff",leyenda:"borrar referencia"}
      this.coloresArr.push(blanco);
      if(this.etapaSelected.isEnded==true)
      {
        this.coloresArr=this.coloresArr.filter(x=>x.idColor==9)
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
        titulo:"¿Desea asignar la siguiente referencia al proceso seleccionado?"
    };
    if(this.etapaSelected.isEnded==true)
    {
      dialogConfig.data.titulo="¡Este proceso se encuentra finalizado! ¿Desea reanudar el proceso?"
    }
    dialogConfig.width= '400px';
    const dialogRef = this.dialog.open(ConfirmAssignDialog, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if(data){
        if(data.idColor!=9)
        {
          if(data.idColor==999999)
          {
            this.etapaSelected.idColor=null; 
            this.etapaSelected.idColorNavigation=null;
          }
          else{
            this.etapaSelected.idColor=data.idColor;
          }
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
  templateUrl: "confirm-assign.html"
})
export class ConfirmAssignDialog{
  colorSelected:Colores;
  titulo:"";

  constructor(
    private dialogRef: MatDialogRef<ConfirmAssignDialog>,public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data1
  ) {
      this.colorSelected=data1.colorSelected
      this.titulo=data1.titulo

    } 

    save(){
      this.dialogRef.close(this.colorSelected);
    }
    onNoClick(){
      this.dialogRef.close();
    }

  }










@Component({
  selector: 'app-transformadores-reloaded',
  templateUrl: './transformadores-reloaded.component.html',
  styleUrls: ['./transformadores-reloaded.component.css']
})
export class TransformadoresReloadedComponent implements OnInit {
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

  selection = new SelectionModel<any>(true, []);

  
  dataTipoTransfo:ComboTipoTransfo[]=[];
  data8TipoTransfo:TipoTransfo[]=[];
  
  
  colores:Colores[]=[];
  displayedColumns1:string[]=['select','Accion']
  displayedColumns2:string[]=[
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
  //esto es una forma cheta de obtener el array con los nombres de
  //las columnas que machean con el "nombreTipoEtapa".
  etapasColumns: string[]= Object.keys(MAP_NOMBRE_ETAPA);

  // TODAS las columnas
  allColumns: string[]= this.displayedColumns1.concat(this.displayedColumns2).concat(this.etapasColumns);
  
  etapasActualizadas:boolean;

  //Filtro
  form=new FormGroup(
    {
      oTe:new FormControl(),	
      nucleos:new FormControl(),
      oPe	:new FormControl(),
      rangoInicio	:new FormControl(),
      rangoFin:new FormControl(),	
      observaciones:new FormControl(),	
      potencia	:new FormControl(),
      nombreCli	:new FormControl(),
      fechaPactada:new FormControl(),
      fechaProd:new FormControl(),
      month:new FormControl()
    }
  )
  
  

  
    oTe= '';
    nucleos='';
    oPe= '';
    rangoInicio= '';
    rangoFin= '';
    observaciones= '';
    potencia= '';
    nombreCli= '';
    month='';


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
    if(a.value - b.value)
    return -1;
    if(b.value - a.value)
    return 1;
    return 0;
  });
  
  


  

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, { static: false }) matTable: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private ngZone: NgZone,private transformadoresService: TransformadoresService, private clientesService: ClienteService, public dialog: MatDialog,
    private route: ActivatedRoute,private _snackBar: MatSnackBar,private etapaService: EtapaService, private tipoEtapaService: TipoEtapaService, private tipoTransfoService: TipoTransfoService, private excelService: ExcelService,private coloresService:ColoresService) { 
      
    }


    ngAfterViewInit() {
      
        this.ngZone.onMicrotaskEmpty.pipe(take(5)).subscribe(() => this.matTable.updateStickyColumnStyles());
    }

  ngOnInit(): void {
    this.dataGetTrafos=new MatTableDataSource();
    this.dataGetTrafos.filterPredicate =this.createFilter();
    this.getTrafos();
    this.getClientes();
    this.getTipoTransfo();

    // timer(1000, 5000).pipe(
    //   mergeMap(() => this.transformadoresService.getTrafos())
    // ).subscribe(
    //   transfo => {
      
      //     this.dataGetTrafos.paginator=this.paginator;
      //     this.dataGetTrafos.sort = this.sort;
      //     this.dataGetTrafos.data=transfo;
        
    //     this.isLoadingResults = false;
    //   }
    // );
    
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
      case'lote':
          trafo="LOT"
          break;
      case'potencia':
          trafo="POT"
          break;
      case'nucleos':
          trafo="NUC"
          break;
      case 'radPan':
          trafo="R/P";
          break;
      case'nombreCli':
          trafo="CLI"
          break;
      case'observaciones':
          trafo="OBS"
          break;
      case 'fechaPactada':
          trafo="FOT"
          break;
      case 'fechaProd':
          trafo="FPR"
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
      case'rangoFin':
          trafo="Lote"
          break;
      case'potencia':
          trafo="Potencia"
          break;
      case'nucleos':
          trafo="Nucleo"
          break;
      case'nombreCli':
          trafo="Cliente"
          break;
      case'observaciones':
          trafo="Observaciones"
          break;
      case 'fechaPactada':
          trafo="Fecha segun OT"
          break;
      case 'fechaProd':
          trafo="Fecha Producción"
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
      this.transformadoresService.getTrafos()
      .subscribe(transfo => {
        this.isLoadingResults = true;
        
        this.dataGetTrafos.paginator = this.paginator;
        this.dataGetTrafos.sort = this.sort;
        this.dataGetTrafos.data=transfo;
        
      }, err => {
        this.isLoadingResults = false;
      },
       () =>{
         this.isLoadingResults=false;
       }
      );
    }

    isGroup(index, item): boolean{
      return item.group;
    }

    
    

    dialogAddTransfo(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        id: 1,
        titulo: "Agregar Transformador",
        labelButton:"Agregar",
        diego:this.diego,
        dataTipoTransfo:this.dataTipoTransfo,
        trafos:this.dataGetTrafos.data
      };
      const dialogRef = this.dialog.open(CourseDialog2Component, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        if (data != undefined) {
          this.data3.forEach((e,i)=>{
            if(data.idCliente==this.data3[i].idCliente){
              
              data.nombreCli=this.data3[i].nombreCli;
            }
          })
          console.log(data);
          data.anio=data.fechaProd.year();
          data.mes=(data.fechaProd.month())+1;
          data.prioridad= 1;
          data.fechaCreacion=new Date();
          if((data.cantidad) > 1){
            var nTransfo = data.cantidad;
            let arregloTransfo:Transformadores[]=[];
            for (let i = 0; i < nTransfo; i++) {
              arregloTransfo[i]=data;
              arregloTransfo[i].lote=data.cantidad;
            }
            console.log("ARREGLO TRANSFOR:",arregloTransfo);
            this.arraySubmit(arregloTransfo,this.dialog);
            arregloTransfo=[];
            this.isLoadingResults=false;
          }
          else{
            data.lote=1;
            console.log("TRAFO CARACTERISTICAS",data);
            this.onFormSubmit(data, this.dialog);
            this.isLoadingResults=false;
          }

        }
        else{
          this.dialog.closeAll();
        }
        
      },err=>
        {
          console.log(err);
        }
      )
      
    }
    
    arraySubmit(array,dialog:MatDialog){
      this.isLoadingResults=true;
      this.transformadoresService.addTransformadores(array).subscribe((res)=>{
        if(res!=undefined){
          this.isLoadingResults=false;
          this.mensajeSnack=`Transformador agregado`
          this.openSnackBar(this.mensajeSnack);
          this.arrayBool=true;
        }
      },
      err => {
        console.log(err);
        this.mensajeSnack=`No se ha agregado ningún transformador`
        this.openSnackBar(this.mensajeSnack);
        this.isLoadingResults=false;
        this.arrayBool=false;
      }
      ,()=>{
        this.getTrafos();
      }
      )
    }
    
    onFormSubmit(form: NgForm, dialog: MatDialog) {
      this.isLoadingResults = true;
      this.transformadoresService.addTransformador(form).subscribe(
        (res) => {
          this.isLoadingResults = false;
          this.mensajeSnack=`Transformador agregado`
          this.openSnackBar(this.mensajeSnack);   
        },
        err => {
          this.mensajeSnack=`No se ha agregado ningún transformador`
          this.openSnackBar(this.mensajeSnack);
          console.log(err);
          this.isLoadingResults = false;
        },()=>{
          this.getTrafos();
        }
        );
      }
      
      getClientes(): void {
        this.clientesService.getClientes()
        .subscribe(cliente => {
          this.data3=cliente;
          this.diego =(<any[]>cliente).map(v => {
            return {id:v.idCliente,value:v.nombreCli,viewValue:v.nombreCli}
          })
        });
      };
      
      getTipoTransfo():void{
        this.tipoTransfoService.getTipoTransfo()
        .subscribe(tipoTransfo => {
          this.data8TipoTransfo=tipoTransfo;
          this.dataTipoTransfo =(<any[]>tipoTransfo).map(v => {
            return {id:v.idTipoTransfo,value:v.nombreTipoTransfo,viewValue:v.nombreTipoTransfo}
          })
        });
      }
      
      getTransformador(id: number) {
        this.transformadoresService.getTransformador(id).subscribe(data => {
          this.idTransfo = data.idTransfo;
          });
        }
        
        deleteTransformador(id: number) {
          this.isLoadingResults = true;
          this.transformadoresService.deleteTransformador(id)
          .subscribe(() => {
            this.isLoadingResults = false;
          }, (err) => {
            console.log(err);
            this.isLoadingResults = false;
          },()=>{
            this.getTrafos();
          }
          );
          
        }
        
        dialogDeleteTransfo(obj): void{
          obj.titulo="Borrar transformador?";
          obj.labelButton="Borrar";
          obj.diego=this.diego;
          this.getTransformador(obj.idTransfo);
          this.dialog.open(CourseDialog4Component,{data:obj});
          const dialogRef4 = this.dialog.open(CourseDialog4Component,{data:obj});
          dialogRef4.afterClosed().subscribe(res =>{
            if((res!=null))
            {
              this.deleteTransformador(res.idTransfo);
              this.openSnackBar('Transformador eliminado');
              this.getTrafos();
            }
            this.dialog.closeAll();
          })
        }
        
        onUpdateSubmit(form: NgForm) {
          this.isLoadingResults = true;
          if(this.idTransfo!==null){
            this.transformadoresService.updateTransformador(this.idTransfo, form).subscribe(
              () => {
                
                this.isLoadingResults = false;
                
              },
              err => {
                console.log(err);
                this.isLoadingResults = false;
              },
              ()=>{
                this.getTrafos();
              }
              );
            }
          }
          
    showOrHide(){
      this.selectColumn=!this.selectColumn;
      
    }


    dialogEditAllTransfo(): void {
      console.log(this.selection.selected);
      let data={
        titulo:"Editar Transformadores",
        labelButton:"Guardar",
        diego:this.diego,
        trafosToModify:this.selection.selected,
        dataTipoTransfo:this.dataTipoTransfo,
        dataTrafos:this.dataGetTrafos,
        colores:this.colores,
        habilitar:true,
        cancelado:false
      }

      const dialogRef3 = this.dialog.open(EditAllTrafosComponent, { 
        width:'100vw',
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
              a.idCliente= (res.f !=null) ? res.f.id : a.idCliente;
              a.nombreCli = (res.f != null ) ? res.f.viewValue : a.nombreCli;
              a.idTipoTransfo= (res.idTipoTransfo != null) ? res.idTipoTransfo : a.idTipoTransfo;
              a.nucleos= (res.nucleos != null) ? res.nucleos : a.nucleos;
              a.oPe= (res.oPe != null) ? res.oPe : a.oPe;
              a.oTe= (res.oTe != null) ? res.oTe : a.oTe;
              a.observaciones = (res.observaciones != null) ? res.observaciones : a.observaciones;
              a.potencia= (res.potencia != null) ? res.potencia : a.potencia;
              a.radPan = (res.radPan  != null) ? res.radPan : a.radPan;
              a.mes = (res.mes  != null) ? res.mes : a.mes;
              a.anio = (res.anio  != null) ? res.anio : a.anio;
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
        this.openSnackBar(err);
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
            this.openSnackBar(err);
            this.isLoadingResults = false;
          },
          ()=>{
            this.getTrafos();
            
          }
          );
        }
    }

    dialogEditTransfo(obj): void {
      obj.titulo="Editar Transformador";
      obj.labelButton="Guardar";
      obj.diego=this.diego;
      
      obj.dataTipoTransfo=this.dataTipoTransfo;
      obj.habilitar=true;
      obj.cancelado=false;
      console.log("o be jota: ",obj);
      this.getTransformador(obj.idTransfo);
      const dialogRef3 = this.dialog.open(CourseDialog4Component, { data:obj});
      dialogRef3.afterClosed().subscribe(res =>{
        // console.log("detalle a ver:",res);
        if(res.cancelado==false){
          this.onUpdateSubmit(res);
          this.dialog.closeAll();
          this.mensajeSnack=`Transformador modificado`;
          this.openSnackBar(this.mensajeSnack);
        }
      })
    }
  
    openSnackBar(mensaje) {
      this._snackBar.open(mensaje,"mensaje", {
         duration: this.durationInSeconds * 1000,
        });
    }
  
    getEtapas(){
      this.etapaService.getEtapas()
      .subscribe(etapa => {
        this.data4=etapa;
      })
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
  
    onRowClicked(row) {
      this.data2 = row;
      forkJoin([
        this.getEtapasporTransfo(this.data2.idTransfo),
        this.getTipoEtapas()
      ]).subscribe(() => {
        this.asignarEtapaTransfo();
        this.openDialogEtapaTransfo(this.data7);
      });    
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
          
        const dialogRef5 = this.dialog.open(ShowInfoComponent,{
          width:'100%',
          position: {
            left: `100px`,
            
          },
          data:obj,
        })
        dialogRef5.afterClosed().subscribe(result => {
          
        })
      }
      
      getDataExcel(): void {
        this.transformadoresService.getDataExcel().subscribe(res=>{this.dataExcel=res})
      }
    
  
  
      export(){
        console.log(this.dataGetTrafos.data);
        
        this.excelService.generateExcel(this.dataGetTrafos.data);
        
      }
  
      

       
      createFilter() {
        return (row:any, filters: string) => {
          
          // split string per '$' to array
          
          const filterArray = filters.split('$');
          
          const oTe = filterArray[0];
          const nucleos = filterArray[1]
          const oPe = filterArray[2];
          const rangoInicio = filterArray[3];
          const potencia = filterArray[4];
          const nombreCli = filterArray[5];
          const month=filterArray[6];
    
          const matchFilter = [];
    
          // // Fetch data from row
          if(row.hasOwnProperty('oTe'))
          {
            const columnOTe = row.oTe==null ? '' : row.oTe;
            const columnNucleos = row.nucleos==null ? '' : row.nucleos;
            const columnOPe = row.oPe==null ? '' : row.oPe;
            const columnRangoInicio = row.rangoInicio==null ? '' : row.rangoInicio;
            const columnPotencia = row.potencia==null ? '' : row.potencia;
            const columnNombreCli = row.nombreCli == null ? '' : row.nombreCli;
            const columnMonth = row.mes==null ? '':row.mes;
            

            //verify fetching data by our searching values
            const customFilterOTe =  columnOTe.toString().includes(oTe);
            const customFilterNucleos =  columnNucleos.toString().toLowerCase().includes(nucleos);
            const customFilterOPe = columnOPe.toString().includes(oPe);
            const customFilterRangoInicio =  columnRangoInicio.toString().includes(rangoInicio);
            const customFilterPotencia =  columnPotencia.toString().includes(potencia);
            const customFilterNombreCli = columnNombreCli.toString().toLowerCase().includes(nombreCli);
            const customFilterMonth = columnMonth.toString().includes(month);
            // //push boolean values into array
            matchFilter.push(customFilterOTe);
            matchFilter.push(customFilterNucleos);
            matchFilter.push(customFilterOPe);
            matchFilter.push(customFilterRangoInicio);
            matchFilter.push(customFilterPotencia);
            matchFilter.push(customFilterNombreCli);
            matchFilter.push(customFilterMonth);
          }
          return matchFilter.every(Boolean);
        };
      }
    
      applyFilter() {
        
        const ot =this.form.get('oTe').value;
        const nucl=this.form.get('nucleos').value;
        const op=this.form.get('oPe').value;
        const rI=this.form.get('rangoInicio').value;
        const pot=this.form.get('potencia').value;
        const nC=this.form.get('nombreCli').value;
        const month=this.form.get('month').value;
    
        this.oTe = ot === null ? '' : ot;
        this.nucleos = nucl === null ? '' : nucl;
        this.oPe = op === null ? '' : op;
        this.rangoInicio = rI === null ? '' : rI;
        this.potencia = pot === null ? '' : pot;
        this.nombreCli = nC === null ? '' : nC;
        this.month= month === null ? '' : month;

        // create string of our searching values and split if by '$'
        const filterValue = this.oTe + '$' + this.nucleos + '$' + this.oPe+'$' + this.rangoInicio+'$' + this.potencia+'$' + this.nombreCli+ '$'+this.month;
        
        this.dataGetTrafos.filter = filterValue.trim().toLowerCase();
      }

      clean(){
        this.form.reset();
        this.dataGetTrafos.filter='';
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
    selector: "alta-transformadores",
    templateUrl: "alta-transformadores.html",
    styleUrls: ['./transformadores-reloaded.component.css']

  })
  
  export class CourseDialog2Component{
  
  
  
    form: FormGroup;
    potencia:number;
    oPe:string;
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
    // rangoFin:number;
    labelButton:string;
    titulo:string;
    data3: Cliente[] = [];
    diego2:ComboClientes[];
    dataTipoTransfo:ComboTipoTransfo[];
    matcher = new MyErrorStateMatcher();
    clientesService: ClienteService;
    selectedCliente: string;
    fechaPactada: Date;
    fechaProd: Date;
    nucleos:string;
    valueTransfo:TipoTransfo;
    filteredOptions: Observable<ComboClientes[]>;
    trafos;
    isFound:boolean=false;
    foundedValue='';
    
    constructor(
      private _snackBar:MatSnackBar,
      private clienteService:ClienteService,
      public dialog:MatDialog,
      private fb: FormBuilder,
      private dialogRefCli: MatDialogRef<CourseDialog3Component>,
      private dialogRef: MatDialogRef<CourseDialog2Component>,
      @Inject(MAT_DIALOG_DATA) data1
    ) {
        this.titulo=data1.titulo;
        this.labelButton=data1.labelButton;
        this.diego2=data1.diego;
        this.potencia=data1.potencia;
        this.oPe=data1.oPe;
        this.dataTipoTransfo=data1.dataTipoTransfo;
        this.oTe=data1.oTe;
        this.cantidad=data1.cantidad;
        this.idCliente=data1.idCliente;
        this.observaciones=data1.observaciones;
        this.trafos=data1.trafos;
      
    }
  
    ngOnInit() {
      this.form = this.fb.group({
        potencia:[this.potencia,[Validators.required]],
        oPe:[this.oPe,[Validators.required]],
        cantidad:[this.cantidad,[Validators.required]],
        oTe:[this.oTe],
        idCliente:[this.idCliente],
        observaciones:[this.observaciones],
        nombreCli:[this.nombreCli],
        idTipoTransfo:[this.idTipoTransfo,[Validators.required]],
        nombreTipoTransfo:[this.nombreTipoTransfo],
        valueTransfo:[this.valueTransfo],
        f:[this.f],
        nucleos:[this.nucleos],
        fechaProd:[this.fechaProd],
        fechaPactada:[this.fechaPactada],
        rangoInicio:[this.rangoInicio],
        radPan:[this.radPan]
      },);  

      console.log("Trafos",this.trafos);

     //filtro
     this.filter();
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
    displayFn(comboCli: ComboClientes): string {
      return comboCli && comboCli.viewValue ? comboCli.viewValue : '';
    }
  
    private _filter(name: string): ComboClientes[] {
      const filterValue = name.toLowerCase();
  
      return this.diego2.filter(option => option.viewValue.toLowerCase().indexOf(filterValue) === 0);
    }

    onBlur(){
      let cantidad=parseInt(this.form.get('cantidad').value);
      let rango=parseInt(this.form.get('rangoInicio').value);
      let op=parseInt(this.form.get('oPe').value)
      console.log("cantidad",cantidad);
      console.log("rango",rango);
      for (let i=0;i<cantidad;i++)
      {
        if(this.trafos.some(x=>x.oPe==op && x.rangoInicio==(i+rango)))
        {
          console.log("FOUND");
          this.foundedValue= `Ya existe el transformador con rango ${rango+i}`;
          break;
        }
        else{
          this.foundedValue="";
        }
      }
    }
    
  
    changeClient(value) {
      return value.id;
    } 
  
    changeTipoTransfo(valueTransfo){
      return valueTransfo.id;
    }
  
    saveTrafo() {
      let cliente=this.form.controls['f'].value;
      this.form.controls['idCliente'].setValue(cliente.id);
      this.form.controls['nombreCli'].setValue(cliente.value);
      this.dialogRef.close(this.form.value);
    }

    save(){
      this.dialogRefCli.close(this.form.value);
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
      this.clienteService.getClientes().subscribe(cliente => {
        this.diego2 =(<any[]>cliente).map(v => {
          return {id:v.idCliente,value:v.nombreCli,viewValue:v.nombreCli}
        })
      }, err => {
        console.log(err);
      });
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

    openSnackBar(mensaje1,mensaje2){
        this._snackBar.open(mensaje1,mensaje2, {
          duration: 2 * 1000,
         });
    }
  
  
  }
  
  
  @Component({
    selector: "editar-transformadores",
    templateUrl: "editar-transformadores.html"
  })
  export class CourseDialog4Component{
  
  
  
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
    mes:number;
    labelButton:string;
    titulo:string;
    data3: Cliente[] = [];
    diego2:ComboClientes[];
    matcher = new MyErrorStateMatcher();
    clientesService: ClienteService;
    selectedCliente: string;
    habilitar: boolean;
    cancelado:boolean;
    idTipoTransfo:number;
    nombreTipoTransfo:string;
    dataTipoTransfo:ComboTipoTransfo[];
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
    
    @Output() 
    dateChange:EventEmitter< MatDatepickerInputEvent<any>>;
    
    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<CourseDialog4Component>,
      @Inject(MAT_DIALOG_DATA) data1
    ) {
        this.titulo=data1.titulo;
        this.labelButton=data1.labelButton;
        this.diego2=data1.diego;
        this.habilitar=data1.habilitar;
        this.idTransfo=data1.idTransfo;
        this.potencia=data1.potencia;
        this.oPe=data1.oPe;
        this.idTipoTransfo=data1.idTipoTransfo;
        this.dataTipoTransfo=data1.dataTipoTransfo;
        this.oTe=data1.oTe;
        this.idCliente=data1.idCliente;
        this.nombreCli=data1.nombreCli;
        this.observaciones=data1.observaciones;
        this.cancelado=data1.cancelado;
        this.f=data1.idClienteNavigation;
        this.anio=data1.anio;
        this.mes=data1.mes;
        this.rangoInicio=data1.rangoInicio;
        this.rangoFin=data1.rangoFin;
        this.fechaPactada=data1.fechaPactada;
        this.fechaProd=data1.fechaProd;
        this.nucleos=data1.nucleos;
        this.prioridad=data1.prioridad;
        this.lote=data1.lote;
        this.radPan=data1.radPan;
        
        
        
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
        radPan:[this.radPan]

      }


      
      ); 



      
      //filtro
      this.filteredOptions = this.form.controls['f'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.viewValue),
        map(name => name ? this._filter(name) : this.diego2.slice())
      );
      
      this.form.controls['f'].setValue({id:this.f.idCliente,value:this.f.nombreCli,viewValue:this.f.nombreCli})
      this.disabling();
      
      
    }
    
    displayFn(comboCli: ComboClientes): string {
          
          return comboCli && comboCli.viewValue ? comboCli.viewValue : '';
      }
      
    private _filter(name: string): ComboClientes[] {
      const filterValue = name.toLowerCase();
  
      return this.diego2.filter(option => option.viewValue.toLowerCase().indexOf(filterValue) === 0);
    }


    disabling(){
      if(this.labelButton=="Borrar"){
        this.form.disable();
      }
    }

    changeDate(event){
      this.form.controls['mes'].setValue((event.value.month())+1);
      this.form.controls['anio'].setValue(event.value.year());
    }
  
    save() {
      console.log("Antes",this.form.value);
      if(this.form.controls['f'].value)
      {
        let cliente=this.form.controls['f'].value;
        console.log(cliente);
        this.form.controls['idCliente'].setValue(cliente.id);
        this.form.controls['nombreCli'].setValue(cliente.value);
      }
      
      
      this.form.value.cancelado=false;
      this.dialogRef.close(this.form.value);
    }
  
    close() {
      if(this.labelButton == "Guardar"){
        this.form.value.cancelado=true;
        this.dialogRef.close(this.form.value);
      }
      else if(this.labelButton == "Borrar") 
      {
        this.dialogRef.close();
      }
    }
  
  }
  
  @Component({
    selector: "info-etapa-transformadores",
    templateUrl: "info-etapa-transformadores.html"
  })
  export class ShowInfoComponent{
    displayedColumns: string[] = ['Nombre de Etapa', 'Fecha Inicio', 'Fecha Fin','Tiempo Parcial', 'Tiempo Fin'];
    dataEtapaPorTransfo:EtapaTransfo[]=[];
    nombreEtapa:string;
    dateIni:Date;
    dateFin:Date;
    tiempoParc:string;
    tiempoFin:string;
    displayedColumns2:string[]=[
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

  
    constructor(private dialogRef: MatDialogRef<ShowInfoComponent>,
      @Inject(MAT_DIALOG_DATA) data1)
      {
  
        
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
    selector: "editar-todos-transformadores",
    templateUrl: "editar-todos-transformadores.html",
    styleUrls:['./transformadores-reloaded.component.css']
  })
  export class EditAllTrafosComponent{
  
  
  
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
    mes:number;
    labelButton:string;
    titulo:string;
    data3: Cliente[] = [];
    diego2:ComboClientes[];
    matcher = new MyErrorStateMatcher();
    clientesService: ClienteService;
    selectedCliente: string;
    habilitar: boolean;
    cancelado:boolean;
    idTipoTransfo:number;
    nombreTipoTransfo:string;
    dataTipoTransfo:ComboTipoTransfo[];
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
    selectedValue: string;
    dataTrafos:MatTableDataSource<any>;
    isLoadingResults=true;
    trafosToModify=null;
    colores:Colores[]=[];
    colorSelected:Colores=null;
    tipoEtapas:TipoEtapa[]=[];
    tipoEtapa=new FormControl();

    options: any[] = [
      {value: '0', viewValue: 'editar datos de cabecera'},
      {value: '1', viewValue: 'editar datos de procesos'}
    ];

    @Output() 
    dateChange:EventEmitter< MatDatepickerInputEvent<any>>;
    

    
    constructor(
      private tipoEtapaService:TipoEtapaService,
      private coloresService:ColoresService,
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<CourseDialog4Component>,
      @Inject(MAT_DIALOG_DATA) data1
    ) {
        this.titulo=data1.titulo;
        this.labelButton=data1.labelButton;
        this.diego2=data1.diego;
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
        nombreCli:[this.nombreCli],
        fechaPactada:[this.fechaPactada],
        fechaProd:[this.fechaProd],
        anio:[this.anio],
        mes:[this.mes]
        
      })
      
      this.filter();
      this.getColores();
      this.getTipoEtapas();

    }

    getColores(){
      this.coloresService.getColores().subscribe(res => {
        this.colores=res;
        this.colores=this.colores.filter((x)=>{ return x.leyenda!=='iniciado' && x.leyenda!=='pausado'})
        let referenceNull:Colores = {
          idColor:100000,
          codigoColor:"#ffffff",
          leyenda:"Quitar referencia actual"
        };
        this.colores.push(referenceNull)
        console.log(this.colores)
      })
    }

    getTipoEtapas(){
      this.tipoEtapaService.getTipoEtapas().subscribe(res =>{
        this.tipoEtapas=res;
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
    displayFn(comboCli: ComboClientes): string {
      return comboCli && comboCli.viewValue ? comboCli.viewValue : '';
    }
  
    private _filter(name: string): ComboClientes[] {
      const filterValue = name.toLowerCase();
  
      return this.diego2.filter(option => option.viewValue.toLowerCase().indexOf(filterValue) === 0);
    }
    
    changeDate(event){
      
      this.form.controls['mes'].setValue((event.value.month())+1);
      this.form.controls['anio'].setValue(event.value.year());
      
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
          IdRef:this.colorSelected
        }
        this.dialogRef.close(obj)
      }
    }
  
    onNoClick(): void {
      this.dialogRef.close();
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
  
  


