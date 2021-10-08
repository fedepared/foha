import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { EtapaEmpleadoService } from '../services/etapaEmpleado.service';
import { EmpleadoService } from '../services/empleado.service';
import { Empleado } from '../models/empleado';
import { EtapaEmpleado } from '../models/etapaEmpleado';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-employer-report',
  templateUrl: './employer-report.component.html',
  styleUrls: ['./employer-report.component.css']
})
export class EmployerReportComponent implements OnInit {
  dataEmpleados:Empleado[]=[];
  isLoadingResults:boolean=false;
  dataEtapaEmpleado:MatTableDataSource<any>;
  empleadosControl = new FormControl();
  filteredOptions: Observable<Empleado[]>;
  displayedColumns: string[] = [ "legajo", "transformador","process","workedTime"];
  isSelected=false;
  noResult=false;
  constructor(private etapaEmpleadoService:EtapaEmpleadoService,private empleadoService:EmpleadoService) { }

  ngOnInit(): void {
    this.getEmpleados();
    this.filteredOptions = this.empleadosControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.dataEmpleados.slice())
      );
  }

  getEtapaEmpleado(id: string) {
    this.etapaEmpleadoService.getEtapaEmpleado(id).subscribe(data => {
      this.dataEtapaEmpleado=new MatTableDataSource();
      this.dataEtapaEmpleado.data=data;
      this.dataEtapaEmpleado.filterPredicate = (data: any, filter) => {
        const dataStr =JSON.stringify(data).toLowerCase();
        return dataStr.indexOf(filter) != -1; 
      }


      console.log(this.dataEtapaEmpleado.data);
      if(this.dataEtapaEmpleado.data.length>0)
      {
        this.isSelected=true;
        this.noResult=false;
      }
      else{
        this.noResult=true;
        this.isSelected=false;
      }

    });
  }

  getEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe(
      res => {
        
        this.dataEmpleados = res.data;
      },
      err => {
        console.log(err);
      }
    );
  }

  search(){
    console.log(this.empleadosControl.value);
    this.getEtapaEmpleado(this.empleadosControl.value.idEmpleado);
     

  }

  displayFn(empleado: Empleado): string {
    return empleado && empleado.nombreEmp ? empleado.nombreEmp : '';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;      
    this.dataEtapaEmpleado.filter = filterValue.trim().toLowerCase();
   
  }


  

  private _filter(name: string): Empleado[] {
    const filterValue = name.toLowerCase();

    return this.dataEmpleados.filter(option => option.nombreEmp.toLowerCase().indexOf(filterValue) === 0);
  }

}
