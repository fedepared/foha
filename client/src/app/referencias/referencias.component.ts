import { Component, OnInit,Inject,Input,Output,EventEmitter } from '@angular/core';
import { ColoresService } from '../services/colores.service';
import { Colores } from '../models/colores';

import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-referencias',
  templateUrl: './referencias.component.html',
  styleUrls: ['./referencias.component.css']
})
export class ReferenciasComponent implements OnInit {
  isLoadingResults = false;
  constructor(private coloresService:ColoresService,public dialog: MatDialog,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getColores();
  }
  referencias : string[] = [ 'Referencia0']
  contador=0;
  dataColores:Colores[]=[];
  displayedColumns:string[]=["codigoColor","leyenda","accion"]
  getColores(){
    this.coloresService.getColores()
    .subscribe((colores)=>{
      this.dataColores=colores;
      console.log(this.dataColores);

    }, err => {
      console.log(err);
    })
  }

  updateColours(evento:boolean){
    if(evento==true)
    {
      this.getColores();
    }
  }


  agregar() { 
    this.contador++;
    this.referencias.push('Timer' + this.contador) 
  }

  dialogEditRef(obj):void{
    console.log(obj);
    obj.titulo="Editar referencia";
    obj.labelButton="editar";

    this.dialog.open(DialogReferenciasDialog,{data:obj});
    const dialogRef3 = this.dialog.open(DialogReferenciasDialog,{data:obj});
    
    dialogRef3.afterClosed().subscribe(res =>{
      if((res))
      {
        console.log("RES",res);
        this.updateColor(res.idColor,res);
        

      }
      this.dialog.closeAll();
      this.getColores();
    },(err)=>{console.log(err)}
    ,()=>{
      this.updateColours(true);
      this.openSnackBar("Referencia editada", "Ok");
    }
    )
  }

  
  updateColor(id: number,color:Colores) {
    this.isLoadingResults = true;
    this.coloresService.updateColor(id,color)
      .subscribe(res => {
          this.isLoadingResults = false;
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

  dialogDeleteRef(obj):void{
    console.log(obj);
    obj.titulo="Desea borrar la referencia?";
    obj.labelButton="borrar";
    // this.getEmpleado(obj.idEmpleado);

    this.dialog.open(DialogReferenciasDialog,{data:obj});
    const dialogRef3 = this.dialog.open(DialogReferenciasDialog,{data:obj});
    
    dialogRef3.afterClosed().subscribe(res =>{
      if((res))
      {
        console.log(res);
        this.deleteColor(res.idColor);
        this.updateColours(true);
        this.openSnackBar("Referencia borrada", "Ok");

      }
      this.dialog.closeAll();
      this.getColores();
    },(err)=>{console.log(err)}
    ,()=>{
      this.updateColours(true);
      this.openSnackBar("Referencia editada", "Ok");
    })
  }

  
  deleteColor(id: number) {
    this.isLoadingResults = true;
    this.coloresService.deleteColor(id)
      .subscribe(res => {
          this.isLoadingResults = false;
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
  
}

@Component({
  selector: 'dialog-ref',
  templateUrl: 'dialog-ref.html',
})
export class DialogReferenciasDialog {
  referencia={
    idColor:0,
    codigoColor:"",
    leyenda:"",

  }
  titulo:string;
  labelButton:string;
  leyendaText:string;
  constructor(private dialogRef: MatDialogRef<DialogReferenciasDialog>,@Inject(MAT_DIALOG_DATA) public data) {
    this.referencia.idColor=data.idColor;
    this.titulo=data.titulo;
    this.referencia.codigoColor=data.codigoColor;
    this.referencia.leyenda=data.leyenda;
    this.labelButton=data.labelButton;
  }

  save() {
    console.log("THIS REFERENCIA",this.referencia);
    this.dialogRef.close(this.referencia);
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
