import { Injectable } from '@angular/core';
import { Empleado } from '../models/empleado';
import { Sectores } from '../models/sectores';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';
import { Reporte } from '../models/reporte';

@Injectable({
  providedIn: 'root'
})
export class ExcelDailyReportService {
  date:string;
  constructor() { }

  generateDailyReport(selectedSector:Sectores,selectedEmpleado:Empleado,begin:Date,end,idColor,reporte:Reporte[]|any){
    // console.log(selectedSector)
    // console.log(selectedEmpleado)
    // console.log(typeof(begin))
    // console.log(end)
    // console.log(idColor)
    // console.log(reporte)
    let comienzo=begin.toLocaleDateString()
    let fin=end.toLocaleDateString()

    const title = `Reporte ${selectedSector.nombreSector}:` ;
    const subtitle = `Empleados: ${selectedEmpleado.nombreEmp}`;
    const range = `Desde: ${comienzo} hasta: ${fin}`
    const startedOrEnded = (idColor==1030) ? "Procesos iniciados" : "Procesos Finalizados"

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte Procesos',{properties:{defaultColWidth:21}});
    let titleRow = worksheet.addRow([title]);

    worksheet.mergeCells('A1:G1');
    worksheet.getCell('A1').font={name: 'Calibri', size: 20, bold: true, color:{argb: 'fbffff'} }
    worksheet.getCell('A1').alignment={horizontal:"center"}
    worksheet.getCell('A1').fill={type: 'pattern',pattern: 'solid',fgColor:{ argb:"#538DD5"},bgColor:{ argb:"#538DD5"}};
    // Set font, size in subtitle row.
    let subtitleRow = worksheet.addRow([subtitle]);
    
    
    worksheet.mergeCells('A2:G2');
    
    worksheet.getCell('A2').font = { name: 'Calibri', size: 16, bold: true, color:{ argb: 'fbffff' } };
    worksheet.getCell('A2').alignment={horizontal:"center"};
    worksheet.getCell('A2').fill={type: 'pattern',pattern: 'solid',fgColor:{ argb:"008080"},bgColor:{ argb:"008080"}};

    // Set font, size in subtitle row.
    let rangeRow = worksheet.addRow([range]);
    
    worksheet.mergeCells('A3:G3');
    worksheet.getCell('A3').font = { name: 'Calibri', size: 14, bold: true, color:{ argb: 'fbffff' } };
    worksheet.getCell('A3').alignment={horizontal:"center"};
    worksheet.getCell('A3').fill={type: 'pattern',pattern: 'solid',fgColor:{ argb:"a52a2a"},bgColor:{ argb:"a52a2a"}};
    



     // Blank Row
    worksheet.addRow([""]);



    worksheet.addRow([""]);
    //Add row with current date
    moment.locale('es');
    this.date=moment().format('D MMMM YYYY, h:mm:ss a');
    let actualizado=worksheet.addRow(['ACTUALIZADO A:  '+this.date]);
    actualizado.font={name: 'Calibri', size: 14, bold: true}
    worksheet.mergeCells(`A${actualizado.number}:F${actualizado.number}`);
    
    // Blank Row
    worksheet.addRow([""]);

    let startedOrEndedRow = worksheet.addRow([startedOrEnded]);
    
    worksheet.mergeCells('A8','L8');
    
    worksheet.getCell('A8').font = { name: 'Calibri', size: 14, bold: true, color:{ argb: 'fbffff' } };
    worksheet.getCell('A8').alignment={horizontal:"left"};
    worksheet.getCell('A8').fill={type: 'pattern',pattern: 'solid',fgColor:{ argb:(idColor==1030)?"1fa9e6":"92d050"},bgColor:{ argb:(idColor==1030)?"1fa9e6":"92d050"}};

    let columnas=worksheet.getRow(9).values= [
      'OP',
      'Rango',
      'OT',
      'Potencia',
      'Tipo',
      'Observaciones',
      'Proceso',
      'Nº Ref Proceso',
      'Fecha de inicio',
      'Fecha de fin',
      'Tiempo',
      'Empleados asignados'
    ]

    worksheet.getRow(9).eachCell((cell, e) => {
      cell.style={alignment:{vertical:'middle',horizontal:'center'}};
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '008080' },
        bgColor: { argb: '008080' }
      }
      cell.font={ name: 'Calibri', size: 10, bold: true, color:{ argb: 'fbffff' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
      let colRow=cell.address.split(/([0-9]+)/g);
      worksheet.mergeCells(`${colRow[0]}9:${colRow[0]}10`)
    })

    worksheet.columns = [
      {key:'OP',width:12},
      {key:'Rango',width:12},
      {key:'OT',width:12},
      {key:'Potencia',width:12},
      {key:'Tipo',width:12},
      {key:'Observaciones',width:12},
      {key:'Proceso',width:12},
      {key:'refProceso',width:12},
      {key:'fechaIni',width:12},
      {key:'fechaFin',width:12},
      {key:'tiempoParc',width:12},
      {key:'operarios',width:70}
    ]

    reporte.forEach((e,j)=>{
      worksheet.addRow({
        OP:e.ope,
        Rango:e.rango,
        OT: e.ote,
        Potencia:e.potencia,
        Tipo:e.tipoTrafo,
        Observaciones:e.observacion,
        Proceso:e.proceso,
        refProceso:e.refProceso,
        fechaIni:this.stringToDate(e.fechaIni),
        fechaFin:this.stringToDate(e.fechaFin),
        tiempoParc:e.tiempoParc,
        operarios:e.operarios
      }).eachCell({includeEmpty: true},(cell,colNumber)=>{
        cell.border={top: { style: 'thin', color: {argb:'000000'} }, left: { style: 'thin', color: {argb:'000000'} }, right: { style: 'thin', color: {argb:'000000'} },bottom:{style:'thin', color: {argb:'000000'}}}
      })
    })

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Reporte.xlsx');
    })
  }
  stringToDate(fot) : Date|any{
    if(fot!=null)
    {
      return new Date(fot.split('T')[0]);
    }
    else{
      return "No Finalizado";
    }
  }


}
