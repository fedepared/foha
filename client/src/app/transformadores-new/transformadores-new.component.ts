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
import moment from 'moment';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { IResponse } from '../models/iresponse';
import { ExcelTimesService } from '../services/excel-times.service';
import { VendedoresService } from '../services/vendedores.service';
import { Vendedores } from '../models/vendedores'; 

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
        "CYP PAT":33,
        "PAT ENV":34,
        "NUC":18,
        "MON":19,
        "CON BT":35,
        "CON AT":36,
        "REL \n TRA":37,
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
        "TERM":30,
        "APR":31,
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
    <div [style.height]="'40px'" [style.border-left]="(etapa.idTipoEtapa==2 || etapa.idTipoEtapa==5 || etapa.idTipoEtapa==8 || etapa.idTipoEtapa==11|| etapa.idTipoEtapa==14) ? '2.5px solid rgba(56,56,56,0.60)' : ((etapa.idTipoEtapa==1) ? '3px solid rgb(56,56,56)': '1px solid rgb(56,56,56)')" [style.background-color] = "etapa.idColorNavigation ? etapa.idColorNavigation.codigoColor : 'white'" [matTooltip]="etapa.idColorNavigation ? etapa.idColorNavigation.leyenda : '' ">
      <span style="padding-left:10px;" *ngIf="(etapa.tiempoParc)!='Finalizada' && (etapa.tiempoParc)!=null" ></span>
      <span style="display:inline;margin:0;width:24px;height:24px;">
        <button mat-icon-button *ngIf="idTipoUs!='4' && (etapa.dateIni==null || etapa.dateFin!==null) " (click)=asignarRef(etapa) matTooltipPosition="above"  matTooltip="Asignar referencia"><mat-icon>lens_blur</mat-icon></button>
      </span>
    </div>
  </ng-container>
  `,

  styleUrls: ['./transformadores-new.component.css']
})
export class EtapaColumnComponent3{
  coloresArr:Colores[]=[];
  etapaSelected:Etapa;
  idTipoUs=null;

  @Input() etapa:Etapa; actualizar:Boolean;
  @Output() actualizado=new EventEmitter<Boolean>();



  constructor(private coloresService:ColoresService,public dialog: MatDialog){}

  ngOnInit(){
    this.idTipoUs=localStorage.getItem("idTipoUs");
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
  templateUrl: "confirm-assign.html",
  styleUrls:["transformadores-new.component.css"]
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

  selection = new SelectionModel<any>(true, []);


  dataTipoTransfo:ComboTipoTransfo[]=[];
  data8TipoTransfo:TipoTransfo[]=[];
  pageNumber:number=1;


  colores:Colores[]=[];
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
  etapasColumns: string[]= Object.keys(MAP_NOMBRE_ETAPA);

  // TODAS las columnas
  allColumns: string[]= this.displayedColumns1.concat(this.displayedColumns2).concat(this.etapasColumns);

  etapasActualizadas:boolean;

  //vendedores
  vendedores:Vendedores[]=[];

  //Filtro
  form=new FormGroup(
    {
      oTe:new FormControl(),
      nucleos:new FormControl(),
      oPe	:new FormControl(),
      rangoInicio	:new FormControl(),
      rangoFin:new FormControl(),
      serie: new FormControl(),
      observaciones:new FormControl(),
      potencia	:new FormControl(),
      nombreCli	:new FormControl(),
      fechaPactada:new FormControl(),
      fechaProd:new FormControl(),
      vendedor:new FormControl(),
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
    serie='';
    vendedor='';
    month=[];
    year=[];


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
  constructor(private ngZone: NgZone,private transformadoresService: TransformadoresService, public dialog: MatDialog,private _snackBar: MatSnackBar,private etapaService: EtapaService, private tipoEtapaService: TipoEtapaService, private excelService: ExcelService,private coloresService:ColoresService, private excelTimesService:ExcelTimesService, private vendedoresService:VendedoresService) {

    }



  ngOnInit(): void {
    this.idTipoUs=localStorage.getItem("idTipoUs");
    console.log(this.idTipoUs);
    this.dataGetTrafos=new MatTableDataSource();
    this.getTrafos();
    this.getMonthYear();
    this.getSellers();
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
      'lote': 'LOT',
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
    
    // switch(trafo)
    // {
    //   case "oTe":
    //       trafo="OT | OR"
    //       break;
    //   case'oPe':
    //       trafo="OP"
    //       break;
    //   case'rangoInicio':
    //       trafo="RNG"
    //       break;
    //   case'lote':
    //       trafo="LOT"
    //       break;
    //   case'potencia':
    //       trafo="POT"
    //       break;
    //   case'nucleos':
    //       trafo="NUC"
    //       break;
    //   case 'radPan':
    //       trafo="R/P";
    //       break;
    //   case'nombreCli':
    //       trafo="CLI"
    //       break;
    //   case 'idVendedorNavigation':
    //       trafo="VEND"
    //       break;
    //   case'observaciones':
    //       trafo="OBS"
    //       break;
    //   case 'fechaPactada':
    //       trafo="FOT"
    //       break;
    //   case 'fechaProd':
    //       trafo="FPR"
    //       break;
    // }
    // return trafo;
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
      'lote':'Lote',
      'potencia':'Potencia',
      'nucleos':'Nucleo',
      'nombreCli':'Cliente',
      'observaciones':'Observaciones',
      'fechaPactada':'Fecha segun OT',
      'fechaProd':'Fecha Producción',
      'idVendedorNavigation':'Vendedor',
    }
    return toolTipTrafo[trafo];
    
    // switch(trafo)
    // {
    //   case 'oTe':
    //       trafo='OT'
    //       break;
    //   case'oPe':
    //       trafo='OP'
    //       break;
    //   case'rangoInicio':
    //       trafo='Rango'
    //       break;
    //   case'rangoFin':
    //       trafo='Lote'
    //       break;
    //   case'potencia':
    //       trafo='Potencia'
    //       break;
    //   case'nucleos':
    //       trafo='Nucleo'
    //       break;
    //   case'nombreCli':
    //       trafo='Cliente'
    //       break;
    //   case'observaciones':
    //       trafo='Observaciones'
    //       break;
    //   case 'fechaPactada':
    //       trafo='Fecha segun OT'
    //       break;
    //   case 'fechaProd':
    //       trafo='Fecha Producción'
    //       break;
    //   case 'idVendedorNavigation':
    //     trafo='Vendedor'
    //     break;
    // }
    // return trafo;
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
      "ENS":"Ensamblaje Bobinas",
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
    }
    return et[etapa];

    // switch(etapa)
    // {
    //   case "DOC":
    //     etapa="Documentación";
    //     break;
    //   case "BT1":
    //     etapa="Bob BT";
    //     break;
    //   case "BT2":
    //     etapa="Bob BT";
    //     break;
    //   case "BT3":
    //     etapa="Bob BT";
    //     break;
    //   case "AT1":
    //     etapa="Bob AT";
    //     break;
    //   case "AT2":
    //     etapa="Bob AT";
    //     break;
    //   case "AT3":
    //     etapa="Bob AT";
    //     break;
    //   case "RG1":
    //     etapa="Bob RG";
    //     break;
    //   case "RG2":
    //     etapa="Bob RG";
    //     break;
    //   case "RG3":
    //     etapa="Bob RG";
    //     break;
    //   case "RF1":
    //     etapa="Bob RF";
    //     break;
    //   case "RF2":
    //     etapa="Bob RF";
    //     break;
    //   case "RF3":
    //     etapa="Bob RF";
    //     break;
    //   case "ENS":
    //     etapa="Ensamblaje Bobinas";
    //     break;
    //   case "PY CYP":
    //     etapa="C Y P PYS";
    //     break;
    //   case "PY SOL":
    //     etapa="Soldadura Prensayugos";
    //     break;
    //   case "PY ENV":
    //     etapa="Envio de PYS";
    //     break;
    //   case "NUC":
    //     etapa="Nucleo";
    //     break;
    //   case "MON":
    //     etapa="Montaje";
    //     break;
    //   case "HOR":
    //     etapa="Horno";
    //     break;
    //   case "CUBA CYP":
    //     etapa="C Y P Tapa-Cuba";
    //     break;
    //   case "SOL \n TAPA":
    //     etapa="TAPA";
    //     break;
    //   case "RAD \n PAN":
    //     etapa="Radiadores o Paneles";
    //     break;
    //   case "CUBA":
    //     etapa="Cuba";
    //     break;
    //   case "HERM":
    //     etapa="Hermeticidad";
    //     break;
    //   case "GRAN":
    //     etapa="Granallado";
    //     break;
    //   case "PINT":
    //     etapa="Pintura";
    //     break;
    //   case "ENC":
    //     etapa="Encubado";
    //     break;
    //   case "LAB":
    //     etapa="Ensayos(Ref)";
    //     break;
    //   case "TERM":
    //     etapa="Terminacion";
    //     break;
    //   case "APR":
    //     etapa="Aprobacion";
    //     break;
    //   case "ENV":
    //     etapa="Envío a cliente";
    //     break;
    //   case "CYP PAT":
    //     etapa="C Y P PATAS"
    //     break;
    //   case "PAT ENV":
    //     etapa="ENVIO PATAS"
    //     break;
    //   case "CON BT":
    //     etapa="CONEXION BT"
    //     break;
    //   case "CON AT":
    //     etapa="CONEXION AT"
    //     break;
    //   case "REL \n TRA":
    //     etapa="RELACION DE TRANSFORMACION"
    //     break;
    //   case "CUBA CYP":
    //     etapa="CUBA C Y P"
    //     break;
    //   case "SOL \n CUBA":
    //     etapa="SOLDADURA CUBA"
    //     break;
    //   case "GRAN \n CUBA":
    //     etapa="GRANALLADO CUBA"
    //     break;
    //   case "PINT \n CUBA":
    //     etapa="PINTURA CUBA"
    //     break;
    //   case "ENV \n CUBA":
    //     etapa="ENVIO CUBA"
    //     break;
    //   case "CYP \n TAPA":
    //     etapa="C Y P TAPA"
    //     break;
    //   case "GRAN \n TAPA":
    //     etapa="GRANALLADO TAPA"
    //     break;
    //   case "PINT \n TAPA":
    //     etapa="PINTURA TAPA"
    //     break;
    //   case "ENV \n TAPA":
    //     etapa="ENVIO TAPA"
    //     break;
    //   case "CUBI":
    //     etapa="CUBIERTA";
    //     break;
    // }
    // return etapa;
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
    return t.etapa[i];
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
          
          // let transfoArray=[];

          // for (let a of transfo)
          // {
          //   let group={group : `${a.mes} de ${a.anio}. Tot:${a.trafos.length}`}
          //   transfoArray.push(group);
          //   for(let b of a.trafos)
          //   {
          //     transfoArray.push(b);
          //   }
          //   console.log(transfoArray)
          //   this.dataGetTrafos.data=transfoArray;
          // }

          this.dataGetTrafos.data=transfo.data;

          //Para trabajarlo
          // this.dataGetTrafos.paginator=this.paginator;
          // transfo.lista.unshift(transfo.id);
          // this.dataGetTrafos.data=transfo.lista;

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
          dataTipoTransfo:this.dataTipoTransfo,
          dataTrafos:this.dataGetTrafos,
          colores:this.colores,
          habilitar:true,
          cancelado:false
        }

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
                a.idVendedor = (res.idVendedor !=null) ? res.idVendedor : a.idVendedor;
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
          (this.form.get('oTe').value && this.form.get('oTe').value.length>=3)||
          (this.form.get('nucleos').value) ||
          (this.form.get('oPe').value && this.form.get('oPe').value.length>=3) ||
          (this.form.get('rangoInicio').value && this.form.get('rangoInicio').value.length>=2) ||
          (this.form.get('potencia').value) ||
          (this.form.get('nombreCli').value && this.form.get('nombreCli').value.length>=3) ||
          (this.form.get('month').value) || 
          (this.form.get('serie').value) ||
          (this.form.get('vendedor').value) ||
          (this.form.get('observaciones').value)
        )
        {
            const ot =this.form.get('oTe').value;
            const nucl=this.form.get('nucleos').value;
            const op=this.form.get('oPe').value;
            const rI=this.form.get('rangoInicio').value;
            const pot=this.form.get('potencia').value;
            const nC=this.form.get('nombreCli').value;
            const partialMonth=this.form.get('month').value;
            const serie = this.form.get('serie').value;
            const vendedor = this.form.get('vendedor').value;
            console.log(vendedor);
            const obs = this.form.get('observaciones').value;
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
            this.nucleos = nucl === null ? ' ' : nucl;
            this.oPe = op === null ? ' ' : op;
            this.rangoInicio = rI === null ? ' ' : rI;
            this.potencia = pot === null ? ' ' : pot;
            this.nombreCli = nC === null ? ' ' : nC;
            this.month= partialMonth === null ? [] : monthArray;
            this.year = partialMonth === null ? [] :yearArray;
            this.serie = serie === null ? ' ' : serie;
            this.vendedor = vendedor === null ? ' ' : vendedor;
            this.observaciones = obs === null ? ' ' : obs; 
            

            let filterValue = {
              oTe :this.oTe,
              nucleos:this.nucleos,
              oPe:this.oPe,
              rangoInicio:this.rangoInicio,
              potencia:this.potencia,
              nombreCli:this.nombreCli,
              month:this.month,
              year:this.year,
              observaciones: this.observaciones,
              serie:this.serie,
              vendedor:this.vendedor
            }
            this.openSnackBar("aplicando los filtros seleccionados","buscando")
            this.transformadoresService.getTrafosFilter(filterValue).subscribe(res=>{

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
                  this.ngZone.onMicrotaskEmpty.pipe(take(3)).subscribe(() => {this.matTable.updateStickyColumnStyles();});
                }
                this.openSnackBar("Transformadores encontrados","Exito!")
              }
              else{
                this.openSnackBar("No existe ningún transformador con el criterio búscado","Advertencia");
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
            console.log(res);
          });
          arregloTransfo=[];
        }
        else{
          this.form.controls['lote'].setValue[1];
          this.transformadoresService.addTransformador(this.form.value).subscribe(
            (res) => {
              this.openSnackBar("Transformador agregado", "Exito!");
            },
            err => {
              this.openSnackBar("No se ha agregado ningún transformador","Error!");
              console.log(err);
          })
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
    templateUrl: "info-etapa-transformadores-new.html"
  })
  export class ShowInfoNewComponent{
    displayedColumns: string[] = ['proceso','refProceso','fechaIni','fechaFin','tiempo','Empleados'];
    dataEtapaPorTransfo:any[]=[];
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

    getclientes(){
      this.clientesService.getClientes().subscribe(res => {
        this.diego2=res.data;
      })
    }

    getTipoEtapas(){
      this.tipoEtapaService.getTipoEtapas().subscribe(res =>{
        this.tipoEtapas=res;
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
          IdRef:this.colorSelected
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