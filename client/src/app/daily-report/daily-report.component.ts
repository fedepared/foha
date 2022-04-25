import { Component, OnInit } from '@angular/core';
import { EtapaService } from '../services/etapa.service';
import { Etapa } from '../models/etapa';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _moment from 'moment';


import {default as _rollupMoment} from 'moment';
import { InterpolationConfig } from '@angular/compiler';
import { Sectores } from '../models/sectores';
import { SectoresService } from '../services/sectores.service';
import { Empleado } from '../models/empleado';
import { EmpleadoService } from '../services/empleado.service';
import { EtapaPorSector } from '../models/etapaPorSector';
import { Reporte } from '../models/reporte';
import { ExcelDailyReportService } from '../services/excel-daily-report.service';
import { MatTableDataSource } from '@angular/material';



export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

const moment =  _moment;

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class DailyReportComponent implements OnInit {
  date = new FormControl(moment("06/10/2020"));
  dataEtapas:Etapa[]=[];
  events: string[] = [];
  resultado:MatTableDataSource<Reporte[]>=new MatTableDataSource<Reporte[]>();
  selectedDate:Date;
  dataEtapasNullTimes:Etapa[]=[];
  isSelected:Boolean=false;
  displayedColumns=["Transformador","tipoProceso","numEtapa","dateIni","dateFin","tiempoFin","empleados"]
  startDate = new Date();
  endDate = new Date();
  form: FormGroup;
  noResult:boolean=false;
  dateRangeDisp= {'begin': new Date(), 'end': new Date()};;
  selectedSector:Sectores={idSector:-99,nombreSector:"None"};
  sectors:Sectores[];
  selectedEmpleado:Empleado={idEmpleado:"-99",nombreEmp:'None',legajo:"-99"};
  empleados:Empleado[];
  etapaPorSector:EtapaPorSector;
  
  form2=new FormGroup(
    {
      proceso:new FormControl(),	
      empleado: new FormControl()
    }
  )

  proceso= '';
  empleado= '';

  constructor(private etapaService:EtapaService,fb: FormBuilder,private sectoresService:SectoresService,private empleadoService:EmpleadoService,private excelDailyReportService:ExcelDailyReportService) {
    this.form = fb.group({
      date: [{begin: this.startDate, end: this.endDate}]
    });
    
   }

  

  ngOnInit(): void {
    this.resultado=new MatTableDataSource();
    this.resultado.filterPredicate =this.createFilter();
    this.getSectores();
  }


  getSectores(){
    this.sectoresService.getSectoresReport().subscribe(res=>{
        this.sectors=res.data;
        this.sectors.unshift({idSector:-1,nombreSector:'Todos los sectores'});
        for(let sector of this.sectors)
        {
          switch(sector.idSector)
          {
            case 7: 
              sector.nombreSector="encubado (Operario)";
              break;
            case 9:
              sector.nombreSector="terminación y despacho (Operario)";
              break;
            case 12:
              sector.nombreSector="encubado (Encargado)";
              break;
            case 21:
              sector.nombreSector="caldereria (Encargado)";
              break;
          }
        }
    })
  }

  changeSector(selectedSector:Sectores)
  {
    if(this.selectedSector.idSector==-1){
      this.selectedEmpleado={idEmpleado:"-99",nombreEmp:'None',legajo:"-99"};
    }
    this.empleadoService.getEmpleadosByIdSector(selectedSector.idSector).subscribe(res=>{
      console.log(this.empleados);
      this.empleados=res.data;
      this.empleados.unshift({idEmpleado:"-1",nombreEmp:"Todos los empleados",legajo:"-1"})
    })
  }

  changeEmpleado(selectedEmpleado:Empleado)
  {
    this.selectedEmpleado=selectedEmpleado;
  }

  search2(booleano:boolean){
    console.log(booleano);

    let comienzo = this.dateRangeDisp.begin.getTime();
    let fin = this.dateRangeDisp.end.getTime();
    
    if(this.selectedSector.idSector==-1){
      this.selectedEmpleado.legajo='-1';
      this.selectedEmpleado.nombreEmp="Todos los empleados";
      this.selectedEmpleado.idEmpleado='-1';
    }


    this.etapaPorSector={
      desdeMili:this.dateRangeDisp.begin.getTime(),
      hastaMili:this.dateRangeDisp.end.getTime(),
      idSect:this.selectedSector.idSector,
      idEmp:this.selectedEmpleado.idEmpleado,
      idColor: booleano ? 1030 : 10
    }

    

    this.etapaService.postEtapasFinalizadas(this.etapaPorSector).subscribe(res => {
      this.resultado.data=res.data;
      if(this.resultado.data.length<1)
      {
        this.noResult=true;
        this.isSelected=false;
      }
      else{
        this.noResult=false;
        this.isSelected=true;
      }
    })
  }

  applyFilter(){
    const proc =this.form2.get('proceso').value;
    const empleado=this.form2.get('empleado').value;
    
    this.proceso = proc === null ? '' : proc;
    this.empleado = empleado === null ? '' : empleado;

    // create string of our searching values and split if by '$'
    const filterValue = this.proceso + '$' + this.empleado;
    
    this.resultado.filter = filterValue.trim().toLowerCase();
  }

  createFilter(){
    return (row:any, filters: string) => {
      
      // split string per '$' to array
      // console.log("Filters",filters);
      // console.log("selected",this.selection.selected);
      const filterArray = filters.split('$');
      
      const proceso = filterArray[0];
      const empleado = filterArray[1];

      const matchFilter = [];

      // // Fetch data from row
      if(row.hasOwnProperty('oTe'))
      {
        const columnProceso = row.proceso==null ? '' : row.proceso;
        const columnEmpleado = row.operarios==null ? '' : row.operarios;
        
        

        //verify fetching data by our searching values
        const customFilterProceso =  columnProceso.toString().includes(proceso);
        const customFilterEmpleado = columnEmpleado.toString().includes(empleado);
        
        // //push boolean values into array
        matchFilter.push(customFilterProceso);
        matchFilter.push(customFilterEmpleado);
      }
      // else{
      //   return false;
      // }



      // return true if all values in array is true
      // else return false
      return matchFilter.every(Boolean);
    };
  }

  export(){
    this.excelDailyReportService.generateDailyReport(this.selectedSector,this.selectedEmpleado,this.dateRangeDisp.begin,this.dateRangeDisp.end,this.etapaPorSector.idColor,this.resultado.data)
  }

  saveDate(event: any) {
    // look at how the date is emitted from save
    
    var date=new Date(event.target.value.end);
    date.setHours(23,59,59);
    
    // change in view
    this.dateRangeDisp = event.target.value;
    this.dateRangeDisp.end=date;
    

    // save date range as string value for sending to db
    //this.field.value = new Date(event.target.value.begin) + "|" + new Date(event.target.value.end);
    // ... save to db
  } 
}
