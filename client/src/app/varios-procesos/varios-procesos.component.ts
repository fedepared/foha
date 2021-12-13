import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Transformadores } from '../models/transformadores';
import { TransformadoresService } from '../services/transformadores.service';
import {SelectionModel} from '@angular/cdk/collections';
import { FormControl, FormGroup } from '@angular/forms';
import { TipoEtapa } from '../models/tipoEtapa';
import { TipoEtapaService } from '../services/tipo-etapa.service';
import { MatCheckboxChange } from '@angular/material';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from "@angular/material/dialog";
import { style } from '@angular/animations';
import { EtapaService } from '../services/etapa.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-varios-procesos',
  templateUrl: './varios-procesos.component.html',
  styleUrls: ['./varios-procesos.component.css']
})
export class VariosProcesosComponent implements OnInit {
  data:MatTableDataSource<Transformadores>;
  dataTipoEtapa:TipoEtapa[]=[];
  isLoadingResults = true;
  etapas=new FormControl();
  displayedColumns:string[]=['select','oT','oP','rango','Cliente','Potencia','Observaciones']
  showButtons=false;
  
  //Variables para los filtros
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
    }
  )
  oTe= '';
  oPe= '';
  rangoInicio= '';
  potencia= '';
  nombreCli= '';
  
  //array con los tranformadores elegidos
  arrTrafoSelected:Transformadores[]=[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(private transformadoresService: TransformadoresService,private tipoEtapaService:TipoEtapaService,public dialog: MatDialog,private _snackBar: MatSnackBar) { }
  
  
  ngOnInit(): void {
    this.data=new MatTableDataSource();
    this.data.filterPredicate =this.createFilter();

    this.getTransformadores();
    this.getTipoEtapas();
  }
  
  selection = new SelectionModel<Transformadores>(true, []);

  getTransformadores(): void {
    this.transformadoresService.getTransformadores()
      .subscribe(transfo => {
        this.data.data = transfo;
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;

        this.isLoadingResults = false;
      }, err => {
        // console.log(err);
        this.isLoadingResults = false;
      });
      
  }

  getTipoEtapas():void{
    this.tipoEtapaService.getTipoEtapas().subscribe(tipoEtapas=>{
      this.dataTipoEtapa=tipoEtapas;
    })
  }

  returnName(idTipoEtapa:number){
        const etapa ={
          1:"DOC",
          2:"BT1",
          3:"BT2",
          4:"BT3",
          5:"AT1",
          6:"AT2",
          7:"AT3",
          8:"RG1",
          9:"RG2",
          10:"RG3",
          11:"RF1",
          12:"RF2",
          13:"RF3",
          14:"ENS",
          15:"PY CYP",
          16:"PY SOL",
          17:"PY ENV",
          33:"CYP PAT",
          34:"PAT ENV",
          18:"NUC",
          19:"MON",
          35:"CON BT",
          36:"CON AT",
          37:"REL \n TRA",
          20:"HOR",
          21:"CUBA CYP",
          23:"RAD \n PAN",
          43:"CUBI",
          24:"SOL \n CUBA",
          25:"HERM",
          26:"GRAN \n CUBA",
          27:"PINT \n CUBA",
          38:"ENV \n CUBA",
          39:"CYP \n TAPA",
          22:"SOL \n TAPA",
          40:"GRAN \n TAPA",
          41:"PINT \n TAPA",
          42:"ENV \n TAPA",
          28:"ENC",
          29:"LAB",
          30:"TERM",
          31:"APR",
          32:"ENV"
        }
        return etapa[idTipoEtapa]
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if(this.data!=undefined)
    {
      const numSelected = this.selection.selected.length;
      const numRows = this.data.data.length;
      return numSelected === numRows;
    }
    else{
      return false;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    
    this.isAllSelected() ?
        this.selectionClear() : 
        this.data.data.forEach(row => {
            let mcc=new MatCheckboxChange();
            mcc.checked=true;

            this.selection.select(row);
            this.checkedValue(row,mcc);
          }
        );
        
  }

  selectionClear(){
    this.selection.clear();
    this.showButtons=false;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Transformadores): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.idTransfo}`;
  }

  checkedValue(row,event){
    //this.selection.toggle(event);
    var i = 0;
    while (i < this.arrTrafoSelected.length) {
      console.log(this.arrTrafoSelected)
      if (this.arrTrafoSelected[i] === row) {
        console.log(this.arrTrafoSelected);
        this.arrTrafoSelected.splice(i, 1);
      } else {
        ++i;
      }
    }
    if(event.checked==true )
    {
      
      this.showButtons=true;
      this.arrTrafoSelected.push(row);
    }
    else{
      let j=this.arrTrafoSelected.indexOf(row);
      if(j>-1)
      {
        this.arrTrafoSelected.splice(j,1);
      }
      if(this.arrTrafoSelected.length==0)
      {
        this.showButtons=false;
      }
    }
    console.log(this.arrTrafoSelected);
  }

  
  etapasChecked(){
    if(this.etapas.value)
    {
      this.openDialogModifyProcess(this.etapas.value,this.arrTrafoSelected);
    }
    else{
      this.openSnackBar("¡Debe seleccionar los procesos a modificar!");
    }
  }

  openDialogModifyProcess(tipoEtapas,arrTrafoSelected){
    const dialogModifyProcess = this.dialog.open(AsignarVariosProcesosComponent, { 
      
      height:'650px',
      data:{
        titulo:"Reasignar Procesos",
        labelButton:"Finalizar asignación",
        dataTrafos:this.data.data,
        tipoEtapas:tipoEtapas,
        arrTrafoSelected:arrTrafoSelected
      }
    });
    
    dialogModifyProcess.beforeClosed().subscribe( res=>{
      if(res){
          this.dialog.closeAll();
      }
    })
  }

  openSnackBar(mensaje) {
    this._snackBar.open(mensaje,"mensaje", {
       duration:  1000,
      });
  }
  
  

  createFilter() {
    return (row:any, filters: string) => {
      
      // split string per '$' to array
      console.log("Filters",filters);
      console.log("selected",this.selection.selected);
      const filterArray = filters.split('$');
      
      const oTe = filterArray[0];
      const oPe = filterArray[1];
      const rangoInicio = filterArray[2];
      const potencia = filterArray[3];
      const nombreCli = filterArray[4];

      const matchFilter = [];

      // // Fetch data from row
      if(row.hasOwnProperty('oTe'))
      {
        const columnOTe = row.oTe==null ? '' : row.oTe;
        const columnOPe = row.oPe==null ? '' : row.oPe;
        const columnRangoInicio = row.rangoInicio==null ? '' : row.rangoInicio;
        const columnPotencia = row.potencia==null ? '' : row.potencia;
        const columnNombreCli = row.nombreCli == null ? '' : row.nombreCli;
        
        

        //verify fetching data by our searching values
        const customFilterOTe =  columnOTe.toString().includes(oTe);
        const customFilterOPe = columnOPe.toString().includes(oPe);
        const customFilterRangoInicio =  columnRangoInicio.toString().includes(rangoInicio);
        const customFilterPotencia =  columnPotencia.toString().includes(potencia);
        const customFilterNombreCli = columnNombreCli.toString().toLowerCase().includes(nombreCli);
        
        // //push boolean values into array
        matchFilter.push(customFilterOTe);
        matchFilter.push(customFilterOPe);
        matchFilter.push(customFilterRangoInicio);
        matchFilter.push(customFilterPotencia);
        matchFilter.push(customFilterNombreCli);
      }
      // else{
      //   return false;
      // }



      // return true if all values in array is true
      // else return false
      return matchFilter.every(Boolean);
    };
  }

  applyFilter() {
    
    const ot =this.form.get('oTe').value;
    const op=this.form.get('oPe').value;
    const rI=this.form.get('rangoInicio').value;
    const pot=this.form.get('potencia').value;
    const nC=this.form.get('nombreCli').value;

    this.oTe = ot === null ? '' : ot;
    this.oPe = op === null ? '' : op;
    this.rangoInicio = rI === null ? '' : rI;
    this.potencia = pot === null ? '' : pot;
    this.nombreCli = nC === null ? '' : nC;

    // create string of our searching values and split if by '$'
    const filterValue = this.oTe + '$' + this.oPe+'$' + this.rangoInicio+'$' + this.potencia+'$' + this.nombreCli;
    
    this.data.filter = filterValue.trim().toLowerCase();
  }

  clean(){
    this.form.reset();
    this.data.filter='';
  }

}


@Component({
  selector: "asignar-varios-procesos",
  templateUrl: "asignar-varios-procesos.html",
  styleUrls: ['./varios-procesos.component.css']
})
export class AsignarVariosProcesosComponent{
  
  titulo:string;
  labelButton:string;
  dataTrafos:MatTableDataSource<Transformadores>=new MatTableDataSource();
  tipoEtapas:TipoEtapa[]=[];
  arrTrafoSeleccionados:Transformadores[]=[];
  arrTrafosNuevos:Transformadores[]=[];
  counterSelected:number=0;
  counterBrought:number=0;
  showAlert:boolean=false;
  displayedColumns:string[]=['selection','oT','oP','rango','Cliente','Potencia','Observaciones']
  foundValues=[];
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
    }
  )
  oTe= '';
  oPe= '';
  rangoInicio= '';
  potencia= '';
  nombreCli= '';
  
  constructor(private transformadoresService:TransformadoresService,private _snackBar: MatSnackBar, private etapaService:EtapaService,public dialog: MatDialog,private dialogRef: MatDialogRef<AsignarVariosProcesosComponent>,
    @Inject(MAT_DIALOG_DATA) data1){
      this.titulo=data1.titulo;
      this.labelButton=data1.labelButton;
      this.tipoEtapas=data1.tipoEtapas;
      this.arrTrafoSeleccionados=data1.arrTrafoSelected;
      // this.dataTrafos.data=data1.dataTrafos;
      this.dataTrafos.data=data1.dataTrafos.filter(function(e){
        return data1.arrTrafoSelected.indexOf(e)<0;
      })
      this.counterBrought=data1.arrTrafoSelected.length;
    };

    ngOnInit(){
      
      console.log(this.tipoEtapas)
      console.log(this.arrTrafoSeleccionados)
      this.dataTrafos.filterPredicate =this.createFilter();
    }
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    seleccion = new SelectionModel<Transformadores>(true, []);

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      if(this.dataTrafos!=undefined)
      {
        const numSelected = this.seleccion.selected.length;
        const numRows = this.dataTrafos.data.length;
        return numSelected === numRows;
      }
      else{
        return false;
      }
    }
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        
      this.isAllSelected() ?
          this.selectionClear() : 
          this.dataTrafos.data.forEach(row => {
              let mcc=new MatCheckboxChange();
              mcc.checked=true;

              this.seleccion.select(row);
              this.checkedValue(row,mcc);
            }
          );
          
    }

    selectionClear(){
      this.seleccion.clear();
      //this.showButtons=false;
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Transformadores): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    
    return `${this.seleccion.isSelected(row) ? 'deselect' : 'select'} row ${row.idTransfo}`;
  }

  checkedValue(row,event){
    //this.selection.toggle(event);
    
    var i = 0;
    while (i < this.arrTrafosNuevos.length) {
      console.log(this.arrTrafosNuevos)
      if (this.arrTrafosNuevos[i] === row) {
        console.log(this.arrTrafosNuevos);
        this.arrTrafosNuevos.splice(i, 1);
        
      } else {
        ++i;
      }
    }
    if(event.checked==true )
    {
      //this.showButtons=true;
      for(let k =0;k<this.tipoEtapas.length;k++)
      {
      // for(var a of row.etapa)
      // {
        // if(a.etapa.some(x=>x.idTipoEtapa==this.tipoEtapas[k].idTipoEtapa && x.dateIni!=null))
        if(row.etapa.some(x=>x.idTipoEtapa==this.tipoEtapas[k].idTipoEtapa && x.dateIni!=null))
        {
          this.showAlert=true;
          this.foundValues.push(row);
          break;
          
          
        }
        else{
          this.showAlert=false;
        }
      //}
      }
      this.arrTrafosNuevos.push(row);
      this.counterSelected++;
      
    }
    else{
      console.log(row);
      let j=this.arrTrafosNuevos.indexOf(row);
      let k=this.foundValues.indexOf(row);
      this.foundValues.splice(k,1);
      if(j>-1)
      {
        this.arrTrafosNuevos.splice(j,1);
        console.log(k);
        
      }
      this.counterSelected--;
      if(this.arrTrafosNuevos.length==0)
      {
        //this.showButtons=false;
      }
    }
    console.log("FoundValues",this.foundValues);
    console.log(this.arrTrafosNuevos);
  }

  foundItem (item,index) {
    return `${item.id}-${index}`;
  }

  foundTrafoNuevo(item,index){
    return `${item.id}-${index}`
  }

  assign(){
    console.log("Found Values",this.foundValues);
    if(this.foundValues.length==0)
    {
      if(this.showAlert==false)
      {
        let idArrTrafoViejo=[];
        let idArrTrafoNuevo=[];
        let idArrTipoEtapas=[]
        for (let i = 0; i < this.arrTrafoSeleccionados.length; i++) {
          idArrTrafoViejo.push(this.arrTrafoSeleccionados[i].idTransfo);
          idArrTrafoNuevo.push(this.arrTrafosNuevos[i].idTransfo);
        }
        for (let j = 0; j < this.tipoEtapas.length; j++) {
          idArrTipoEtapas.push(this.tipoEtapas[j].idTipoEtapa);
        }

        const dialogRef = this.dialog.open(ChangeConfirmAssignComponent, {
          width: '400px',
          panelClass: 'custom-modalbox'
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if(result)
          {
            this.etapaService.switchArrTrafos(idArrTrafoNuevo,idArrTrafoViejo,idArrTipoEtapas).subscribe(()=>{
              this.openSnackBar("Procesos Modificados Correctamente");
              this.dialogRef.close(true);  
            })
          }
        });
        
      }
    }
    else{
      
    }
    
    
  }

    createFilter() {
      return (row:any, filters: string) => {
        
        // split string per '$' to array
        console.log("Filters",filters);
        const filterArray = filters.split('$');
        
        const oTe = filterArray[0];
        const oPe = filterArray[1];
        const rangoInicio = filterArray[2];
        const potencia = filterArray[3];
        const nombreCli = filterArray[4];
  
        const matchFilter = [];
  
        // // Fetch data from row
        if(row.hasOwnProperty('oTe'))
        {
          const columnOTe = row.oTe==null ? '' : row.oTe;
          const columnOPe = row.oPe==null ? '' : row.oPe;
          const columnRangoInicio = row.rangoInicio==null ? '' : row.rangoInicio;
          const columnPotencia = row.potencia==null ? '' : row.potencia;
          const columnNombreCli = row.nombreCli == null ? '' : row.nombreCli;
          
          
  
          //verify fetching data by our searching values
          const customFilterOTe =  columnOTe.toString().includes(oTe);
          const customFilterOPe = columnOPe.toString().includes(oPe);
          const customFilterRangoInicio =  columnRangoInicio.toString().includes(rangoInicio);
          const customFilterPotencia =  columnPotencia.toString().includes(potencia);
          const customFilterNombreCli = columnNombreCli.toString().toLowerCase().includes(nombreCli);
          
          // //push boolean values into array
          matchFilter.push(customFilterOTe);
          matchFilter.push(customFilterOPe);
          matchFilter.push(customFilterRangoInicio);
          matchFilter.push(customFilterPotencia);
          matchFilter.push(customFilterNombreCli);
        }
        // else{
        //   return false;
        // }
  
  
  
        // return true if all values in array is true
        // else return false
        return matchFilter.every(Boolean);
      };
    }
  
    applyFilter() {
      
      const ot =this.form.get('oTe').value;
      const op=this.form.get('oPe').value;
      const rI=this.form.get('rangoInicio').value;
      const pot=this.form.get('potencia').value;
      const nC=this.form.get('nombreCli').value;
  
      this.oTe = ot === null ? '' : ot;
      this.oPe = op === null ? '' : op;
      this.rangoInicio = rI === null ? '' : rI;
      this.potencia = pot === null ? '' : pot;
      this.nombreCli = nC === null ? '' : nC;
  
      // create string of our searching values and split if by '$'
      const filterValue = this.oTe + '$' + this.oPe+'$' + this.rangoInicio+'$' + this.potencia+'$' + this.nombreCli;
      this.dataTrafos.filter = filterValue.trim().toLowerCase();
    }
  
    clean(){
      this.form.reset();
      this.dataTrafos.filter='';
    }

    openSnackBar(mensaje) {
      this._snackBar.open(mensaje,"mensaje", {
         duration:  1000,
        });
    }
}

@Component({
  selector: "change-confirm-assign",
  templateUrl: "change-confirm-assign.html"
})
export class ChangeConfirmAssignComponent{
  constructor(
    public dialogRef: MatDialogRef<ChangeConfirmAssignComponent>,
    @Inject(MAT_DIALOG_DATA) public data1) {}
  

  click():void{
    this.dialogRef.close(true);
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
