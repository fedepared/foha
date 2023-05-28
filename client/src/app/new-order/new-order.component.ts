import { Component, OnInit, Inject } from '@angular/core';
import { Transformadores } from '../models/transformadores';
import { TransformadoresService } from '../services/transformadores.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material';
import { MonthYear } from '../models/monthYear';
import { OrderTrafo } from '../models/orderTrafo';


export interface OrderTransfo{
  id:string;
  lista:Transformadores[];
}

interface Mes {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {
  isLoadingResults=true;
  events = [];
  data=[];
  transfoInter:OrderTrafo[]=[];
  connectedTo=[];
  orderFin:any[]=[];
  orderDefinitivo:OrderTrafo[]=[];
  anio:number;
  mesActual:number;
  counter:number;
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
    {value:13, viewValue:"Stock"},
    {value:14, viewValue:"Entrega pendiente"},
    {value:15, viewValue:"Monte"}
  ];
  //para checkbox
  meses=[];
  //vista de los checkbox
  mesesTrafo=[]
  //guardo temporalmente al filtrar
  transfoInterKeep=[];
  isfiltered:boolean=false;



  constructor(private transformadoresService:TransformadoresService,private _snackBar: MatSnackBar,public dialog: MatDialog) { }

  ngOnInit(): void {
    // this.getOrden();
    this.getMonthYear()

  }

  getMonthYear(){
    this.transformadoresService.getMonthYear().subscribe(res=>{
      this.mesesTrafo=res;
    })
  }

  toggle(item,event: MatCheckboxChange) {
    if (event.checked) {
     this.meses.push(item);
   } else {
     const index = this.meses.indexOf(item);
     if (index >= 0) {
       this.meses.splice(index, 1);
     }
   }
  console.log(item + "<>", event.checked);
 }

 exists(item) {
   return this.meses.indexOf(item) > -1;
 };

 isIndeterminate() {
   return (this.meses.length > 0 && !this.isChecked());
 };

 isChecked() {
   return this.meses.length === this.transfoInter.length;
 };



 toggleAll(event: MatCheckboxChange) {

   if ( event.checked ) {
      console.log(this.transfoInter);
      this.transfoInter.forEach(row => {
         // console.log('checked row', row);

         this.meses.push(row)
         });
         console.log(this.meses)

       // console.log('checked here');
   } else {
     // console.log('checked false');
      this.meses.length = 0 ;
   }
}


  filter(){
      console.log(this.meses);
      let filterValue:MonthYear[]=this.meses.map(x=>{
        return {month:x.idMes,year:x.anio}
      });
      if(this.meses.length>0)
      {
        this.isfiltered=!this.isfiltered;
        if(this.isfiltered==true)
        {
          this.transfoInterKeep=this.transfoInter;
          this.transfoInter=this.transfoInter.filter((f)=> {return this.meses.includes(f.id)})
          this.transformadoresService.getOrderTrafo(filterValue).subscribe(res=>{
              this.transfoInter=res.data;
          })

        }
        else{
          this.meses.length=0;
          this.transfoInter=this.transfoInterKeep;
        }
      }
      else{
        this.openSnackBar("Debe seleccionar aunque sea un valor","error");
      }
  }



  clearEvents(): void {
    this.events = [];
  }

  itemsRemoved(ev, list) {
    console.log(ev)
    this.events.push({text: `itemsRemoved from ${list}`, ev: JSON.stringify(ev)});

  }

  itemsAdded(ev, list) {
    console.log(ev)
    this.events.push({text: `itemsAdded to ${list} `, ev: JSON.stringify(ev)});
  }

  itemsUpdated(ev, list) {
    console.log(ev)
    this.events.push({text: `itemsUpdated in ${list}`, ev: JSON.stringify(ev)});

  }

  selectionChanged(ev, list) {
    console.log(ev)
    this.events.push({text: `selectionChanged in ${list}`, ev: JSON.stringify(ev)});
    this.orderDefinitivo=list;
    console.log(this.orderDefinitivo);
  }

  addAnioMes():void{
    const dialogRef = this.dialog.open(AltaAnioMesReloaded, {
      width: '250px',
      data: {anio: this.anio, mes: this.mes}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        var nuevoPer:OrderTrafo={id:`Año:${result.anio} Mes:${result.mes}`,anio:result.anio,mes:result.mes,lista:[]};
        this.connectedTo.push(`Año:${result.anio} Mes:${result.mes}`);
        this.transfoInter.push(nuevoPer);
        this.orderFin.push(nuevoPer);
      }
    });
  }

  save(){
    console.log(this.orderDefinitivo);
    for(let oD of this.orderDefinitivo)
    {

      console.log("antes",oD.lista.map(({idTransfo,prioridad,oTe,oPe})=>({idTransfo,prioridad,oTe,oPe})));
      oD.lista.map((trafo,index)=>{
        trafo.anio = oD.anio;
        trafo.mes = oD.mes;
        trafo.prioridad = index;
      })
      //  oD.lista.forEach((e,i)=>{
      //   e.anio=oD.anio;
      //   e.mes=oD.mes;
      //   e.prioridad=i;
        // this.transformadoresService.updateTransformador(e.idTransfo,e)
        // .subscribe(transfo => {
        //   this.isLoadingResults = false;
        //   }, err => {
        //     console.log(err);
        //     this.openSnackBar("Error al guardar:",err)
        //     this.isLoadingResults = false;
        //   });
      // }
      // this.transformadoresService.metodoNuevo([])
      console.log("despues",oD.lista.map(({idTransfo,prioridad,oTe,oPe})=>({idTransfo,prioridad,oTe,oPe})));
      let month = this.mes.find((x)=>x.value==oD.mes)
      this.transformadoresService.newUpdateAllTrafos(oD.lista).subscribe(res =>{
        console.log("entro al updateAllTrafos");
        if(res.status == 200){
          this.openSnackBar(`Se actualizaron las prioridades del mes de ${month.viewValue} de ${oD.anio}`,"")
          this.transformadoresService.AsignarFechaProdMesGet(oD.mes,oD.anio).subscribe((re)=>{
            console.log("entro al AsignarFechaProdMesGet");
            console.log(res);
            if(res.status==200){
              this.openSnackBar(`${res.message}`,"")
            }
          })
        }
      });
    }
    this.transformadoresService.ChequearFechasProdGet().subscribe((res)=>{
      console.log("metodito");
      // if(res){
      //   this.openSnackBar(`${res.toString}`,"");
      // }
    })
    this.openSnackBar("Orden Guardado!","Ok")
    this.getMonthYear();
  }



  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}


@Component({
  selector: 'altaAnioMesReloaded',
  templateUrl: 'altaAnioMesReloaded.html',
})
export class AltaAnioMesReloaded {
  mes:Mes[]=[];
  selected;
  anio:number=0;
  constructor(@Inject(MAT_DIALOG_DATA) public data,public dialogRef: MatDialogRef<AltaAnioMesReloaded>,) {
    this.mes=data.mes;
  }

  ngOnInit(){
    // console.log(this.mes);
  }

  save(){
    let data={

      anio:this.anio,
      mes:this.selected
    }
    this.dialogRef.close(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
