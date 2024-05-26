import { Component, OnInit, Input,EventEmitter,Output, Inject } from '@angular/core';
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


interface ComboEmpleado{
  id:string;
  nombreEmpleado:string;
  value:string;
  viewValue:string;
}

export interface DialogData {
  ok:boolean;
  empleadoValue: string;
  transfoValue: string;
  etapaValue:string;
}

@Component({
  selector: 'app-reloj',
  templateUrl: './reloj.component.html',
  styleUrls: ['./reloj.component.css']
})
export class RelojComponent implements OnInit{
  
  @Input('procesoSelected') procesoElegido: Etapa;
  @Output() procesoUpdated = new EventEmitter<boolean>();

  proceso:Etapa;
  numEtapa:number=0;
  selectedProceso:Boolean=false;
  dataEmpleados:Empleado[]=[];
  comboEmpleados:ComboEmpleado[];
  isLoadingResults=true;
  empleado:ComboEmpleado;
  nuevoEmpleado:ComboEmpleado;
  empleadosAdded:ComboEmpleado[]=[];
  arr:ComboEmpleado[]=[];
  play=true;
  isPause=false;
  isStop=true;
  class:boolean=true;
  tiempo:Timer=new Timer();
  tiempoNuevo:Timer=new Timer();
  comienzo=true;
  ok=false;
  empleadosProcesoPausado:ComboEmpleado[]=[];
  sector:number=0;
  showButtons:boolean;
  trafoAssigned:Transformadores=new Transformadores();
  tipoEtapaSelected:TipoEtapa=new TipoEtapa();
  tipoEtapaNombre:string='';
  array=[];
  //variable para que aparezca el botón de eliminar componente
  processEnded=false;
  arrLength:number;

  constructor(private empleadoService:EmpleadoService,private transformadoresService:TransformadoresService,private _snackBar: MatSnackBar,private etapaService:EtapaService,private tipoEtapaService:TipoEtapaService,public dialog:MatDialog,private authService:AuthService) { }


  ngOnInit(): void {
    document.body.scrollIntoView(false);
    console.log(this.procesoElegido);
    this.selectedProceso=true;
    this.proceso=this.procesoElegido;
    if(this.proceso.idColor==1030)
    {
      this.play=false;
    }
    if(this.proceso.idColor==9 || this.proceso.idColor==null)
    {
      this.class=false;
      this.isStop=false;
    }

    this.getTrafo(this.procesoElegido.idTransfo);
    this.getTipoEtapa(this.procesoElegido.idTipoEtapa);
    this.numEtapa=this.proceso.numEtapa;
    if(this.proceso.idTipoEtapa==1 ||this.proceso.idTipoEtapa==15 ||  this.proceso.idTipoEtapa==17 || this.proceso.idTipoEtapa==18 || this.proceso.idTipoEtapa==21 || this.proceso.idTipoEtapa==23 || this.proceso.idTipoEtapa==31 ||this.proceso.idTipoEtapa==32 || this.proceso.idTipoEtapa==33 || this.proceso.idTipoEtapa==34 || this.proceso.idTipoEtapa==38 || this.proceso.idTipoEtapa==39 || this.proceso.idTipoEtapa==42 || this.proceso.idTipoEtapa==44)
    {
      this.showButtons=true;
    }
    else{
      this.showButtons=false;
    }
    //chequeo de que el proceso sea de horno
    if(this.proceso.idTipoEtapa==20){
      this.isStop=false;
    }

    this.arr.push({id:"",nombreEmpleado:"",value:"",viewValue:""});
    
    this.sector=parseInt(localStorage.getItem('sector'));
    this.getEmpleados();
    console.log(this.proceso); 
  }


  encabezadosEtapas(etapa:TipoEtapa){
    switch(etapa.nombreEtapa)
    {
      case "documentacion":
        this.tipoEtapaNombre="Documentación";
        break;
      case "bobinaBT1":
        this.tipoEtapaNombre="Bob BT 1";
        break;
      case "bobinaBT2":
        this.tipoEtapaNombre="Bob BT 2";
        break;
      case "bobinaBT3":
        this.tipoEtapaNombre="Bob BT 3";
        break;
      case "bobinaAT1":
        this.tipoEtapaNombre="Bob AT 1";
        break;
      case "bobinaAT2":
        this.tipoEtapaNombre="Bob AT 2";
        break;
      case "bobinaAT3":
        this.tipoEtapaNombre="Bob AT 3";
        break;
      case "bobinaRG1":
        this.tipoEtapaNombre="Bob RG 1";
        break;
      case "bobinaRG2":
        this.tipoEtapaNombre="Bob RG 2";
        break;
      case "bobinaRG3":
        this.tipoEtapaNombre="Bob RG 3";
        break;
      case "bobinaRF1":
        this.tipoEtapaNombre="Bob RF 1";
        break;
      case "bobinaRF2":
        this.tipoEtapaNombre="Bob RF 2";
        break;
      case "bobinaRF3":
        this.tipoEtapaNombre="Bob RF 3";
        break;
      case "ensamblajeBobinas":
        this.tipoEtapaNombre="Ensamblaje Bobinas";
        break;
      case "corteYPlegadoPYS":
        this.tipoEtapaNombre="C Y P PYS";
        break;
      case "soldaduraPYS":
        this.tipoEtapaNombre="Soldadura Prensayugos";
        break;
      case "envioPYS":
        this.tipoEtapaNombre="Envio de PYS";
        break;
      case "nucleo":
        this.tipoEtapaNombre="Nucleo";
        break;
      case "montaje":
        this.tipoEtapaNombre="Montaje";
        break;
      case "horno":
        this.tipoEtapaNombre="Horno";
        break;
      case "cYPTapaCuba":
        this.tipoEtapaNombre="C Y P Tapa-Cuba";
        break;
      case "tapa":
        this.tipoEtapaNombre="Soldadura Tapa";
        break;
      case "radiadoresOPaneles":
        this.tipoEtapaNombre="Radiadores o Paneles";
        break;
      case "cuba":
        this.tipoEtapaNombre="Soldadura Cuba";
        break;
      case "tintasPenetrantes":
        this.tipoEtapaNombre="Hermeticidad";
        break;
      case "granallado":
        this.tipoEtapaNombre="Granallado Cuba";
        break;
      case "pintura":
        this.tipoEtapaNombre="Pintura Cuba";
        break;
      case "encubado":
        this.tipoEtapaNombre="Encubado";
        break;
      case "ensayosRef":
        this.tipoEtapaNombre="Ensayos(Ref)";
        break;
      case "terminacion":
        this.tipoEtapaNombre="Terminacion";
        break;
      case "envioADeposito":
        this.tipoEtapaNombre="Envio a depósito";
        break;
      case "envioACliente":
        this.tipoEtapaNombre="Envío a cliente";
        break;
      
      case "CYPPatas":
        this.tipoEtapaNombre="C y P Patas";
        break;
      case "EnvioPatas":
        this.tipoEtapaNombre="Envío Patas";
        break;
      case "ConexBT":
        this.tipoEtapaNombre="Conexión BT";
        break;
      case "conexAT":
        this.tipoEtapaNombre="Conexión AT";
        break;
      case "RelacTransf":
        this.tipoEtapaNombre="Relación de Transformación";
        break;
      case "EnvioCuba":
        this.tipoEtapaNombre="Envío Cuba";
        break;
      case "cYPTapa":
        this.tipoEtapaNombre="C y P Tapa";
        break;
      case "GranalladoTapa":
        this.tipoEtapaNombre="Granallado Tapa";
        break;
      case "PinturaTapa":
        this.tipoEtapaNombre="Pintura Tapa";
        break;
      case "EnvioTapa":
        this.tipoEtapaNombre="Envío Tapa";
        break;
      case "Cubierta":
        this.tipoEtapaNombre="Cubierta";
        break;
      case "ChapaDeCaracteristicas":
        this.tipoEtapaNombre="Chapa de caracaterísticas";
        break;
    }
    return this.tipoEtapaNombre
  }

  numeroEtapa(evento){
    this.numEtapa=evento.target.value;
  }

  getTrafo(id){
    this.transformadoresService.getTransformador(id)
    .subscribe(trafo =>{
      this.trafoAssigned=trafo;
      console.log(this.trafoAssigned);
    })
  }

  getTipoEtapa(id){
    this.tipoEtapaService.getTipoEtapa(id)
    .subscribe(tipoEtapa =>{
      this.tipoEtapaSelected=tipoEtapa;
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
      
      this.comboEmpleados =(<any[]>this.dataEmpleados).map(v => {
        return {
          id:v.idEmpleado,nombreEmpleado:v.nombreEmp,value:v.nombreEmp,viewValue:v.nombreEmp
        }
      })
      
      //Obtengo los últimos empleados
      if(this.proceso.etapaEmpleado.length>0)
      {
        let max=new Date(Math.max.apply(null, this.proceso.etapaEmpleado.map(function(e) {
          return new Date(e.dateIni);
        })));
        console.log(max);
        for(var a of this.proceso.etapaEmpleado)
        {
          let fecha=new Date(a.dateIni); 
          console.log(fecha);         
          if(fecha.getTime()===max.getTime())
          {
            console.log(this.comboEmpleados);
            let empleado=this.comboEmpleados.find(x=>x.id==a.idEmpleado);
            console.log(empleado);
            this.empleadosProcesoPausado.push(empleado);
          }
        }
      }
      console.log(this.arr)
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }

  empleadoSelected(empleado){
    this.empleado=empleado;
    console.log(this.empleado);
  }

  addEmpleado(nuevoEmpleado,i){
    console.log(nuevoEmpleado);
    this.arr[i]=nuevoEmpleado;
  }

  addSelect(){
    let empleadoSelected:ComboEmpleado={id:"",nombreEmpleado:"",value:"",viewValue:""};
    this.arr.push(empleadoSelected);
    console.log(this.arr);
  }


  change(event,i)
  {
    console.log(i);
    console.log(event);
    console.log(this.arr);
  }


  removeSelect(){
    this.arr.pop();
    console.log("removed:",this.arr);
  }

  openSnackBar(mensaje,tiempo) {
    this._snackBar.open(mensaje,"mensaje", {
       duration: tiempo * 1000,
      });
  }

  //TIMER EN SI
  finalizar(){
    if(this.arr[0].value==='')
    {
      this.openSnackBar("debe elegir un empleado antes de finalizar el proceso",1500);
    }else{
      for (let b of this.arr)
      {
        this.array.push(b.value);
        console.log(this.array)
      }
      if(this.proceso && this.array.length>0)
      {
        
        this.proceso.idColor=10;
        this.proceso.isEnded=true;
        this.proceso.tiempoParc="00:00:00:00";
        this.proceso.tiempoFin="00:00:00:00";
        this.proceso.dateIni=new Date();
        this.proceso.dateFin=new Date();
        this.proceso.numEtapa=this.numEtapa;
        let empleadosProceso=new Array<Empleado>();
  
        let preEtapaEmpleado=new Array<EtapaEmpleado>();
        for (let a of this.array)
        {
          preEtapaEmpleado.push({idEmpleado:a.id,dateIni:this.proceso.dateIni,idEtapa:this.proceso.idEtapa,tiempoParc:"00:00:00:00"}) 
        }
  
        this.proceso.etapaEmpleado=preEtapaEmpleado;
  
        this.etapaService.stopEtapaEspecial(this.proceso.idEtapa,this.proceso).subscribe(
        (res)=>{
          console.log(res);
        }
        ,(err)=>{
          console.log(err);
        }
        ,()=>{
          this.openSnackBar("Etapa Finalizada",5);
          this.procesoUpdated.emit(true);
        }
          
          
        )
      }
      else{
        this.openSnackBar("Debe elegir un proceso, un/os empleado/s",5);
      }
      this.array=[]
    }
    
  }

  start(){
    if(this.arr[0].value==='')
    {
      this.openSnackBar("debe elegir un empleado antes de finalizar el proceso",1500);
    }else{
      this.arrLength=this.arr.length;
      for (let b of this.arr)
      {
        this.array.push(b.value);
        console.log(this.array)
      }
      console.log(this.array)
      
      if(this.proceso && this.numEtapa && this.array.length>0)
      {
        let empezado:Boolean;
        let fechaProcesoReiniciado=new Date();
        this.play=false;
        this.isPause=!this.isPause;
        if(this.proceso.idTipoEtapa!=20)
        {
          this.isStop=true;
        }
        this.class=true;
        this.openSnackBar("Proceso iniciado",2);
        
        //Si el proceso está pausado
        if(this.proceso.dateIni != null && this.proceso.dateFin == null)
        {
          empezado=true;
          if(this.comienzo==true){
            this.comienzo=false;
          }
        }
  
        //Si el proceso se inicia por primera vez 
        if(this.proceso.dateIni == null && this.proceso.dateFin == null)
        {
          empezado=false;
          if(this.comienzo==true){
            this.proceso.numEtapa=this.numEtapa;
          }
        }
  
  
        let preEtapaEmpleado=new Array<EtapaEmpleado>();
        for (let a of this.array)
        {
          preEtapaEmpleado.push({idEmpleado:a.id,dateIni:fechaProcesoReiniciado,idEtapa:this.proceso.idEtapa,tiempoParc:""}) 
        }
        this.proceso.etapaEmpleado=preEtapaEmpleado;
        this.proceso.idColor=1030;
        console.log(this.proceso);
        this.etapaService.updateEtapaInicio(this.proceso.idEtapa,this.proceso).subscribe(
          (res) => {
                console.log(res);
                this.isLoadingResults = false;
                this._snackBar.open(res,"Advertencia",{
                  panelClass: ['success-snackbar']
                })
          },
          err => {
            console.log(err);
            this._snackBar.open(err.error,"Error",{
              panelClass: ['success-snackbar']
            })
            this.isLoadingResults = false;
            this.array=[];
            this.play=!this.play;
            this.isPause=!this.isPause;
            this.isStop=!this.isStop;
            this.class=!this.class;
            this.proceso.etapaEmpleado=[];

          },
          ()=>{
            this.procesoUpdated.emit(true);
          }
        );
        this.comienzo=false;
  
      }
      else
      {
        this.openSnackBar("Debe elegir un proceso, un/os empleado/s,y un número de referencia",5);
      }
      this.array=[];
    }
  }

  pause(){
    this.openSnackBar(`Proceso pausado`,3);
    this.isPause=!this.isPause;
    this.play=true;
    this.class=false;
    this.isStop=false;
    for(var b of this.proceso.etapaEmpleado)
    {
      b.tiempoParc="";
    }
    this.proceso.idColor=9;
    this.proceso.isEnded=false;
    console.log(this.proceso);
    this.etapaService.updateEtapaPausa(this.proceso.idEtapa,this.proceso).subscribe(
      (res) => {
            console.log(res);
            this.isLoadingResults = false;
      },
      err => {
        console.log(err);
        this.isLoadingResults = false;
      },
      ()=>{
        this.procesoUpdated.emit(true);
      }
    );
    this.comienzo=false;
  }

  addOnTheGo(){
    if(this.arr.length!=this.arrLength)
    {
        // this.pause();
        // this.start();
        Promise.resolve(this.pause()).then(()=>{
          return Promise.resolve(this.start());
      });
    }
    else{
      this.openSnackBar("debe agregar empleados", "error");
    }
  }

  

  stop(){
    if(this.arr.length==0){
      this.openSnackBar("Debe elegir primero un empleado para finalizar un proceso",1500);
    }else{
      this.openDialog();
      this.processEnded=true;
    }
    
    
  }

  openDialog(){
    const dialogRef=this.dialog.open(DialogFinalizarProceso,{
      width:'300px',
      data: {ok:this.ok}
    })


    dialogRef.afterClosed().subscribe((confirmado:Boolean)=>{
      if(confirmado){
        this.proceso.isEnded=true;
        
        this.proceso.idColor=10;
        this.etapaService.updateEtapaStop(this.proceso.idEtapa,this.proceso).subscribe(
          (res) => {
            console.log(res);
            if(res.status==200){
              this.proceso=null;
              this.empleado=null;
              this.comienzo=true;
              this.isStop=false;
              this.class=false;
              this.isPause=false;
              this.play=false;
              this.openSnackBar('Proceso Finalizado!',5);
              this.isLoadingResults = false;
              this.procesoUpdated.emit(true);
            }
          },
          err => {
            console.log(err);
            this.proceso.isEnded=false;
            this.isLoadingResults = false;
          },
          ()=>{
          }
        );
        
      }
      else{
        // console.log("No cancelado");
      }
    })

  }

}



@Component({
  selector: 'finalizar-proceso',
  templateUrl: 'finalizar-proceso.html',
})

export class DialogFinalizarProceso {

  ok:boolean;
  constructor(
    public dialogRef: MatDialogRef<DialogFinalizarProceso>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
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


