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
  endDate = new Date(2019, 1, 20);
  form: FormGroup;
  noResult:boolean=false;
  dateRangeDisp;
  
  constructor(private etapaService:EtapaService,fb: FormBuilder) {
    this.form = fb.group({
      date: [{begin: this.startDate, end: this.endDate}]
    });
   }

  

  ngOnInit(): void {
    this.getEtapasFinalizadas();
    
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

  search2(){
    
    this.resultado = this.dataEtapas.filter((item: any) => {
      return (item.dateFin.getTime() >= this.dateRangeDisp.begin.getTime()) &&
      (item.dateFin.getTime() <= this.dateRangeDisp.end.getTime());
    });
    console.log(this.resultado);
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
