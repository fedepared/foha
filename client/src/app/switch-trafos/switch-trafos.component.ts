import { OverlayKeyboardDispatcher } from '@angular/cdk/overlay';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { EnroqueTrafos } from '../models/enroqueTrafos';
import { DialogData } from '../reloj/reloj.component';
import { TransformadoresService } from '../services/transformadores.service';

@Component({
  selector: 'app-switch-trafos',
  templateUrl: './switch-trafos.component.html',
  styleUrls: ['./switch-trafos.component.css']
})
export class SwitchTrafosComponent implements OnInit {
  
  originSelection=[];
  arriveSelection=[];
  resCompleted:boolean=false;

  constructor(private _snackBar: MatSnackBar,public dialog: MatDialog,private transformadoresService:TransformadoresService) { }

  

  ngOnInit(): void {
  }


  receiveSelected($event) {
    this.originSelection=$event
  }

  sendSelection($event){
    this.arriveSelection=$event;
    console.log(this.arriveSelection)
    if(this.originSelection.length == this.arriveSelection.length){
      const dialogRef = this.dialog.open(ConfirmDialog,{
        data:{
          originSelection:this.originSelection,
          arriveSelection:this.arriveSelection
        }
      
      })
      dialogRef.afterClosed().subscribe(result => {
        let enroqueTrafos:EnroqueTrafos = {
          trafosDesde : this.originSelection.map((x)=> x.idTransfo),
          trafosHasta : this.arriveSelection.map((x)=> x.idTransfo)
        }
        if(result)
        {
          this.transformadoresService.postEnroqueTrafos(enroqueTrafos).subscribe(res=>{
            if(res.status==200){
              this.resCompleted=true;
            }
          })
        }
      });
      
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

@Component({
  selector: 'confirm',
  templateUrl: 'confirm.html',
  styleUrls: ['switch-trafos.component.css'],
  styles: ['#chip{height:fit-content; width:fit-content;background-color:teal;color:white;}',
            '::ng-deep .mat-chip-list-wrapper{display: block}',
            '::ng-deep .mat-chip-list-wrapper mat-chip {display: block;float: left;clear: left;}',
            '::ng-deep .mat-chip-list-wrapper .mat-chip-input {width: 100%;}'
  ] 
})
export class ConfirmDialog {
  originSelection=[];
  arriveSelection=[];
  constructor(@Inject(MAT_DIALOG_DATA) public data) {
    this.originSelection=this.data.originSelection
    this.arriveSelection=this.data.arriveSelection
  }
}
