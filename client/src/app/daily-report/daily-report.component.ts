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
  resultado:Etapa[]=[];
  selectedDate:Date;
  dataEtapasNullTimes:Etapa[]=[];
  isSelected:Boolean=false;
  displayedColumns=["numEtapa","tipoProceso","dateIni","dateFin","tiempoFin","Transformador"]
  startDate = new Date();
  endDate = new Date();
  form: FormGroup;
  noResult:boolean=false;
  dateRangeDisp;
  selectedSector:Sectores={idSector:-99,nombreSector:"None"};
  sectors:Sectores[];
  selectedEmpleado:Empleado={idEmpleado:"-99",nombreEmp:'None',legajo:"-99"};
  empleados:Empleado[];


  constructor(private etapaService:EtapaService,fb: FormBuilder,private sectoresService:SectoresService,private empleadoService:EmpleadoService) {
    this.form = fb.group({
      date: [{begin: this.startDate, end: this.endDate}]
    });
   }

  

  ngOnInit(): void {
    this.getSectores();
    //this.getEtapasFinalizadas();
    
  }

  getEtapasFinalizadas(): void {
    this.etapaService.getEtapasFinalizadas()
      .subscribe(etapas => {
        this.dataEtapas = etapas;
        for (var a of this.dataEtapas)
        {
          a.dateFin=new Date(a.dateFin);
        }
        console.log(this.dataEtapas);
        
      }, err => {
        console.log(err);
        
      })
  }

  getSectores(){
    this.sectoresService.getSectoresReport().subscribe(res=>{
        this.sectors=res.data;
        this.sectors.unshift({idSector:-1,nombreSector:'Todos'});
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
      this.empleados.unshift({idEmpleado:"-1",nombreEmp:"Todos",legajo:"-1"})
    })
  }

  changeEmpleado(selectedEmpleado:Empleado)
  {
    this.selectedEmpleado=selectedEmpleado;
  }

  search2(){
    let comienzo = this.dateRangeDisp.begin.getTime();
    let fin = this.dateRangeDisp.end.getTime();
    
    if(this.selectedSector.idSector==-1){
      this.selectedEmpleado.legajo='-1';
    }

    let etapaPorSector:EtapaPorSector={
      desdeMili:this.dateRangeDisp.begin.getTime(),
      hastaMili:this.dateRangeDisp.end.getTime(),
      idSect:this.selectedSector.idSector,
      idEmp:this.selectedEmpleado.legajo
    }

    this.etapaService.postEtapasFinalizadas(etapaPorSector).subscribe(res => {
      console.log(res)
    })
    
    if(this.resultado.length<1)
    {
      this.noResult=true;
      this.isSelected=false;
    }
    else{
      this.noResult=false;
      this.isSelected=true;
    }
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
