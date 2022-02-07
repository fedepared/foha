import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-switch-trafos',
  templateUrl: './switch-trafos.component.html',
  styleUrls: ['./switch-trafos.component.css']
})
export class SwitchTrafosComponent implements OnInit {
  
  originSelection=[];
  arriveSelection=[]

  constructor(private _snackBar: MatSnackBar) { }

  

  ngOnInit(): void {
  }


  receiveSelected($event) {
    // this.selection.push($event)
    this.originSelection=$event
    console.log(this.originSelection)
  }

  sendSelection($event){
    this.arriveSelection=$event;
    if(this.originSelection.length == this.arriveSelection.length){
      this.openSnackBar("Bien elegido","Capo");
    }else{
      this.openSnackBar("Debe seleccionar la misma cantidad de transformadores de origen y destino", "Error!")
    }
  }

  openSnackBar(mensaje1,mensaje2) {
    this._snackBar.open(mensaje1,mensaje2, {
       duration: 2000,
      });
  }

}
