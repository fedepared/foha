import { Component, OnInit, Input,EventEmitter,Output, Inject, ElementRef } from '@angular/core';
import { Etapa } from '../models/etapa';
import { EmpleadoService } from '../services/empleado.service';
import { Empleado } from '../models/empleado';
import { Timer } from 'easytimer.js';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EtapaService } from '../services/etapa.service';
import { EtapaEmpleado } from '../models/etapaEmpleado';
import { AuthService } from '../services/auth.service';
import { Transformadores } from '../models/transformadores';
import { TransformadoresService } from '../services/transformadores.service';
import { TipoEtapaService } from '../services/tipo-etapa.service';
import { TipoEtapa } from '../models/tipoEtapa';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-reloj-multiple',
  templateUrl: './reloj-multiple.component.html',
  styleUrls: ['./reloj-multiple.component.css']
})
export class RelojMultipleComponent implements OnInit {

  @Input('multiProcessTrafoSelected') multiProcessTrafoSelected: number[];
  @Output() multiProcessUpdated = new EventEmitter<boolean>();
  @Output() multiProcessFinished = new EventEmitter<boolean>();
  

  trafo:number[]=[];
  process=new FormControl(null);
  processList=new FormControl();
  trafoProcessList:Transformadores[]=[];
  employersList=new FormControl();
  etapa:any;
  sector:number=0;
  dataEmpleados:Empleado[]=[];
  showButtons:Boolean;
  tipoEtapas:TipoEtapa[]=[];
  
  //booleanos para los Botones 
  play=true;
  isPause=false;
  isStop=true;
  class:boolean=true;
  comienzo=true;
  ok=false;
  processEnded=false;


  constructor(private el: ElementRef,private etapaService:EtapaService,private tipoEtapaService:TipoEtapaService,private empleadoService:EmpleadoService,private _snackBar: MatSnackBar,public dialog:MatDialog) {
  }
  
  ngOnInit(): void {
    // document.body.scrollIntoView(false);

    document.getElementById("target").scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
      });

    console.log(this.multiProcessTrafoSelected)
    this.trafo=this.multiProcessTrafoSelected;
    // this.etapaService.getEtapaByIdTransfo(this.trafo.idTransfo,parseInt(localStorage.getItem('sector'))).subscribe(res => {
    //   this.etapa=res;
    // })
    this.sector=parseInt(localStorage.getItem('sector'));
    this.getEmpleados();
    this.getTipoEtapas();
  }

  encabezadosEtapas(idTipoEtapa){
    switch(idTipoEtapa)
    {
      case 1:
        return "Documentación";
      case 2:
        return "Bob BT 1";
      case 3:
        return "Bob BT 2";
      case 4:
        return "Bob BT 3";
      case 5:
        return "Bob AT 1";
      case 6:
        return "Bob AT 2";
      case 7:
        return "Bob AT 3";
      case 8:
        return "Bob RG 1";
      case 9:
        return "Bob RG 2";
      case 10:
        return "Bob RG 3";
      case 11:
        return "Bob RF 1";
      case 12:
        return "Bob RF 2";
      case 13:
        return "Bob RF 3";
      case 14:
        return "Ensamblaje Bobinas";
      case 15:
        return "C Y P PYS";
      case 16:
        return "Soldadura Prensayugos";
      case 17:
        return "Envio de PYS";
      case 18:
        return "Nucleo";
      case 19:
        return "Montaje";
      case 20:
        return "Horno";
      case 21:
        return "C Y P Tapa-Cuba";
      case 22:
        return "TAPA";
      case 23:
        return "Radiadores o Paneles";
      case 24:
        return "Cuba";
      case 25:
        return "Tintas penetrantes";
      case 26:
        return "Granallado";
      case 27:
        return "Pintura";
      case 28:
        return "Encubado";
      case 29:
        return "Ensayos(Ref)";
      case 30:
        return "Terminacion";
      case 31:
        return "Envio a depósito";
      case 32:
        return "Envío a cliente";
      case 33:
        return "C y P Patas";
      case 34:
        return "Envío Patas";
      case 35:
        return "Conexión BT";
      case 36:
        return "Conexión AT";
      case 37:
        return "Relación de Transformación";
      case 38:
        return "Envío Cuba";
      case 39:
        return "C y P Tapa";
      case 40:
        return "Granallado Tapa";
      case 41:
        return "Pintura Tapa";
      case 42:
        return "Envío Tapa";
      case 43:
        return "Cubierta";
        
      
    }
  }

  comboChange(){
      this.trafoProcessList=[];
      for(let i=0;i<this.trafo.length;i++)
      {
        this.etapaService.getByIdTrafoIdTipoEtapa(this.trafo[i],this.process.value.idTipoEtapa).subscribe(res => {
          if(res.hasOwnProperty("idTransfo"))
          {
            this.trafoProcessList.push(res);
          }
        },()=>{},()=>{
          if(this.trafoProcessList[0].etapa[0].idTipoEtapa==1 ||this.trafoProcessList[0].etapa[0].idTipoEtapa==15 ||  this.trafoProcessList[0].etapa[0].idTipoEtapa==17 || this.trafoProcessList[0].etapa[0].idTipoEtapa==18 || this.trafoProcessList[0].etapa[0].idTipoEtapa==21 || this.trafoProcessList[0].etapa[0].idTipoEtapa==23 || this.trafoProcessList[0].etapa[0].idTipoEtapa==31 ||this.trafoProcessList[0].etapa[0].idTipoEtapa==32 || this.trafoProcessList[0].etapa[0].idTipoEtapa==33 || this.trafoProcessList[0].etapa[0].idTipoEtapa==34 || this.trafoProcessList[0].etapa[0].idTipoEtapa==39 || this.trafoProcessList[0].etapa[0].idTipoEtapa==42)
          {
            this.showButtons=true;
          }
          else{
            this.showButtons=false;
          }
        })
      }


      setTimeout(()=>{
        let idColor=this.trafoProcessList[0].etapa[0].idColor;
        for(let i=1;i<this.trafoProcessList.length;i++)
        {
          if(this.trafoProcessList[i].etapa[0].idColor!=idColor)
          {
            this.openSnackBar("Los procesos elegidos poseen distintos estados","advertencia");
            this.trafoProcessList=[];
            break;
          }
          if(this.trafoProcessList[i].etapa[0].idColor==10)
          {
            this.openSnackBar("Los procesos elegidos están finalizados","advertencia");
            this.trafoProcessList=[];
            break;
          }
        }
      },3000)
  }

  getTipoEtapas(){
    this.tipoEtapaService.getTipoEtapas().subscribe(res => {
      this.tipoEtapas = res;
    })
  }

  getEmpleados(): void {
    this.empleadoService.getEmpleados()
    .subscribe(res => {
      this.dataEmpleados = res.data;
      if(this.sector!=10)
      {
        if(this.sector == 22 || this.sector == 23 || this.sector == 24 || this.sector == 25)
        {
          this.dataEmpleados= this.dataEmpleados.filter(sector => sector.idSector == 3)
        }
        else{
          this.dataEmpleados=this.dataEmpleados.filter(sector=>sector.idSector==this.sector)
        }
      }
    })
  }

  getEtapaById(idTransfo){
    let a= this.trafoProcessList.find(etapa=>etapa.idTransfo==idTransfo);
    return a;

  }

  start(){
    
      let empezado:Boolean;
      let fechaProcesoReiniciado=new Date();
      this.play=false;
      this.isPause=!this.isPause;
      this.isStop=true;
      this.class=true;
      this.openSnackBar("Proceso iniciado","Exito!");
      

      for(let proceso of this.trafoProcessList)
      {
        //Si el proceso está pausado
        if(proceso.etapa[0].dateIni != null && proceso.etapa[0].dateFin == null)
        {
          empezado=true;
          if(this.comienzo==true){
            this.comienzo=false;
          }
        }

        //Si el proceso se inicia por primera vez 
        if(proceso.etapa[0].dateIni == null && proceso.etapa[0].dateFin == null)
        {
          empezado=false;
        }


        let preEtapaEmpleado=new Array<EtapaEmpleado>();
        for (let a of this.employersList.value)
        {
          preEtapaEmpleado.push({idEmpleado:a.idEmpleado,dateIni:fechaProcesoReiniciado,idEtapa:proceso.etapa[0].idEtapa,tiempoParc:""}) 
        }
        proceso.etapa[0].etapaEmpleado=preEtapaEmpleado;
        proceso.etapa[0].idColor=1030;
        console.log(proceso.etapa[0]);
        this.etapaService.updateEtapaInicio(proceso.etapa[0].idEtapa,proceso.etapa[0]).subscribe(
          (res) => {

                // this.isLoadingResults = false;
          },
          err => {
            console.log(err);
            // this.isLoadingResults = false;
          },
        );
      }
      this.comienzo=false;
      this.multiProcessUpdated.emit(true);
  }

  pause(){
    this.openSnackBar(`Proceso pausado`,"Exito!");
    this.isPause=!this.isPause;
    this.play=true;
    this.class=false;
    this.isStop=false;

    for(let proceso of this.trafoProcessList)
    {

      for(var b of proceso.etapa[0].etapaEmpleado)
      {
        b.tiempoParc="";
      }
      proceso.etapa[0].idColor=9;
      proceso.etapa[0].isEnded=false;
      console.log(proceso);
      this.etapaService.updateEtapaPausaMulti(proceso.etapa[0].idEtapa,proceso.etapa[0],this.trafoProcessList.length).subscribe(
        (res) => {
              // this.isLoadingResults = false;
        },
        err => {
          console.log(err);
          // this.isLoadingResults = false;
        },
      );
    }
    this.comienzo=false;
    setTimeout(()=>{
      this.multiProcessUpdated.emit(true);
    },1300)
  }

  stop(){

    this.openDialog();
    this.processEnded=true;
  }

  finalizar(){
    for(let proceso of this.trafoProcessList)
    {
      
      proceso.etapa[0].idColor=10;
      proceso.etapa[0].isEnded=true;
      proceso.etapa[0].tiempoParc="00:00:00:00";
      proceso.etapa[0].tiempoFin="00:00:00:00";
      proceso.etapa[0].dateIni=new Date();
      proceso.etapa[0].dateFin=new Date();

      let preEtapaEmpleado=new Array<EtapaEmpleado>();
      for (let a of this.employersList.value)
      {
        preEtapaEmpleado.push({idEmpleado:a.idEmpleado,dateIni:proceso.etapa[0].dateIni,idEtapa:proceso.etapa[0].idEtapa,tiempoParc:"00:00:00:00"}) 
      }

      proceso.etapa[0].etapaEmpleado=preEtapaEmpleado;

      this.etapaService.stopEtapaEspecial(proceso.etapa[0].idEtapa,proceso.etapa[0]).subscribe(
      (res)=>{
        console.log(res);
      }
      ,(err)=>{
        console.log(err);
      }
      ,()=>{
        this.openSnackBar("Etapa Finalizada",5);
      }
      )
    }
    this.multiProcessUpdated.emit(true);
  }

  openDialog(){
    const dialogRef=this.dialog.open(DialogFinalizarProcesoMultiple,{
      width:'300px',
      data: {ok:this.ok}
    })


    dialogRef.afterClosed().subscribe((confirmado:Boolean)=>{
      if(confirmado){
        for(let proceso of this.trafoProcessList)
        {
          proceso.etapa[0].isEnded=true;
          
          proceso.etapa[0].idColor=10;
          console.log(proceso);
          this.etapaService.updateEtapaStopMulti(proceso.etapa[0].idEtapa,proceso.etapa[0],this.trafoProcessList.length).subscribe(
            (res) => {
  
              // this.isLoadingResults = false;
            },
            err => {
              console.log(err);
              // this.isLoadingResults = false;
            },
            ()=>{
            }
            );
          }
          this.multiProcessFinished.emit(true);
          this.processList.reset();
          this.employersList.reset();
          this.comienzo=true;
          this.isStop=false;
          this.class=false;
          this.isPause=false;
          this.play=false;
        this.openSnackBar('Proceso Finalizado!',"Exito!");
      }
    })

  }

   

  destroy(){
    this.multiProcessFinished.emit(false);
  }

  openSnackBar(mensaje,mensaje2) {
    this._snackBar.open(mensaje,mensaje2, {
       duration: 3000,
      });
  }

}

@Component({
  selector: 'finalizar-proceso-multiple',
  templateUrl: 'finalizar-proceso-multiple.html',
})

export class DialogFinalizarProcesoMultiple {

  ok:boolean;
  constructor(
    public dialogRef: MatDialogRef<DialogFinalizarProcesoMultiple>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.ok=data.ok;
    }
    ngOnInit() {

    }

  onClick(){
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
