import { Component, OnInit, Inject } from '@angular/core';
import { Transformadores } from '../models/transformadores';
import { TransformadoresService } from '../services/transformadores.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material';


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
  transfoInter:OrderTransfo[]=[];
  connectedTo=[];
  orderFin:any[]=[];
  orderDefinitivo:OrderTransfo[]=[];
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
    {value:13, viewValue:"Stock"}

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

//   getOrden(){
//     this.transformadoresService.getOrden()
//     .subscribe(transfoOrden=>{
//       this.data=transfoOrden;
//       console.log(this.data);
//       let anterior=null;
//       var transfo:OrderTransfo={id:'',lista:[]};
      
//       this.data.forEach((e,i )=> {
//         e.forEach((f,j) => {     
//           transfo.id=`Año:${f.anio} Mes:${f.mes}`;
//           transfo.lista.push(f);
//           if((`Año:${f.anio} Mes:${f.mes}`)!=anterior)
//           {
//             this.connectedTo.push(`Año:${f.anio} Mes:${f.mes}`);
//           }
//           anterior=`Año:${f.anio} Mes:${f.mes}`;
//         });
//         this.transfoInter.push(transfo);
//         this.mesesTrafo.push(transfo.id);
//         transfo={id:'',lista:[]};
//       })
        

//       console.log("Transfo Inter",this.transfoInter);
//       console.log(this.connectedTo);
//       let transfoList={id:'',lista:[]};
//       this.connectedTo.forEach((e)=>{
//         transfoList={
//           id:e,
//           lista:[],
//         }
//         this.orderFin.push(transfoList);
//       })
      
      
//       this.transfoInter.forEach((e)=>{
//         var l = this.orderFin.findIndex(o => o.id === e.id);
//         if (this.orderFin[l]) { this.orderFin[l] = e } else { this.orderFin.push(e) };

//       })
//       console.log(this.orderFin);
      
//     },err=>{
// //      this.isLoadingResults=false;
//     })
//     console.log(this.transfoInter);
//   }

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
      if(this.meses.length>0)
      {
        this.isfiltered=!this.isfiltered;
        if(this.isfiltered==true)
        {
          this.transfoInterKeep=this.transfoInter;
          this.transfoInter=this.transfoInter.filter((f)=> {return this.meses.includes(f.id)})
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
        var nuevoPer:OrderTransfo={id:`Año:${result.anio} Mes:${result.mes}`,lista:[]};
        this.connectedTo.push(`Año:${result.anio} Mes:${result.mes}`);
        this.transfoInter.push(nuevoPer);
        this.orderFin.push(nuevoPer);
      }
    });
  }

  save(){
    console.log(this.orderDefinitivo);
    this.orderDefinitivo.forEach((e)=>{
      let anio:number=parseInt(e.id.slice(4,8))
      let mes:number=parseInt(e.id.slice(13,15))
      console.log(mes)
      e.lista.forEach((a,i)=>{
        
        a.anio=anio;
        a.mes=mes;
        a.prioridad=i
        this.transformadoresService.updateTransformador(a.idTransfo,a)
        .subscribe(transfo => {
          this.isLoadingResults = false;
          }, err => {
            console.log(err);
            this.openSnackBar("Error al guardar:",err)
            this.isLoadingResults = false;
          });
      })
      
    })
    this.openSnackBar("Orden Guardado!","Ok")
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
