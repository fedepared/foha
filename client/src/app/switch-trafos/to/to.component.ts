import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { Transformadores } from 'src/app/models/transformadores';
import { TransformadoresService } from 'src/app/services/transformadores.service';

@Component({
  selector: 'app-to',
  templateUrl: './to.component.html',
  styleUrls: ['./to.component.css']
})
export class ToComponent implements OnInit {

  data:MatTableDataSource<Transformadores>;
  isLoadingResults = true;
  displayedColumns:string[]=['select','oT','oP','rango','Cliente','Potencia','Observaciones']
  showButtons=false;
  selection = new SelectionModel<Transformadores>(true, []);
  
  form=new FormGroup(
    {
      oTe:new FormControl(),	
      oPe	:new FormControl(),
      rangoInicio	:new FormControl(),
      potencia:new FormControl(),
      nombreCli	:new FormControl(),
      observaciones:new FormControl()
    }
  )

  oTe= '';
  oPe= '';
  rangoInicio= '';
  potencia='';
  nombreCli='';
  observaciones= '';

  //array con los tranformadores elegidos
  arrTrafoSelected:Transformadores[]=[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private transformadoresService:TransformadoresService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.data=new MatTableDataSource();
    this.data.filterPredicate =this.createFilter();

    this.getTransformadores();
  }

  getTransformadores(): void {
    this.transformadoresService.getTransformadoresNoProcess()
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

  selectionClear(){
    this.selection.clear();
    this.showButtons=false;
  }

  createFilter() {
    return (row:any, filters: string) => {
      
      // split string per '$' to array
      // console.log("Filters",filters);
      // console.log("selected",this.selection.selected);
      const filterArray = filters.split('$');
      
      const oTe = filterArray[0];
      const oPe = filterArray[1];
      const rangoInicio = filterArray[2];
      const potencia = filterArray[3];
      const nombreCli = filterArray[4];
      const observaciones = filterArray[5];

      const matchFilter = [];

      // // Fetch data from row
      if(row.hasOwnProperty('oTe'))
      {
        const columnOTe = row.oTe==null ? '' : row.oTe;
        const columnOPe = row.oPe==null ? '' : row.oPe;
        const columnRangoInicio = row.rangoInicio==null ? '' : row.rangoInicio;
        const columnPotencia = row.potencia==null ? '' : row.potencia;
        const columnNombreCli = row.nombreCli == null ? '' : row.nombreCli;
        const columnObservaciones = row.observaciones == null ? '' : row.observaciones;
        
        

        //verify fetching data by our searching values
        const customFilterOTe =  columnOTe.toString().includes(oTe);
        const customFilterOPe = columnOPe.toString().includes(oPe);
        const customFilterRangoInicio =  columnRangoInicio.toString().includes(rangoInicio);
        const customFilterPotencia =  columnPotencia.toString().includes(potencia);
        const customFilterNombreCli = columnNombreCli.toString().toLowerCase().includes(nombreCli);
        const customFilterObservaciones = columnObservaciones.toString().toLowerCase().includes(observaciones);
        
        // //push boolean values into array
        matchFilter.push(customFilterOTe);
        matchFilter.push(customFilterOPe);
        matchFilter.push(customFilterRangoInicio);
        matchFilter.push(customFilterPotencia);
        matchFilter.push(customFilterNombreCli);
        matchFilter.push(customFilterObservaciones);
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
    const obs=this.form.get('observaciones').value;

    this.oTe = ot === null ? '' : ot;
    this.oPe = op === null ? '' : op;
    this.rangoInicio = rI === null ? '' : rI;
    this.potencia = pot === null ? '' : pot;
    this.nombreCli = nC === null ? '' : nC;
    this.observaciones = obs === null ? '' : obs;

    // create string of our searching values and split if by '$'
    const filterValue = this.oTe + '$' + this.oPe+'$' + this.rangoInicio+'$' + this.potencia+'$' + this.nombreCli+'$' + this.observaciones;
    
    this.data.filter = filterValue.trim().toLowerCase();
  }

  clean(){
    this.form.reset();
    this.data.filter='';
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
  

  openSnackBar(mensaje1,mensaje2) {
    this._snackBar.open(mensaje1,mensaje2, {
       duration: 2000,
      });
  }

}
