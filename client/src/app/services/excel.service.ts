import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import {View} from '../models/view';
import * as moment from 'moment';
import { Transformadores } from '../models/transformadores';
//import { DatePipe } from '../../../node_modules/@angular/common';

const MAP_NOMBRE_ETAPA: { [tipoEtapa: string]: number} = {
  "documentacion":1,
  "bobinaBT1":2,
  "bobinaBT2":3,
  "bobinaBT3":4,
  "bobinaAT1":5,
  "bobinaAT2":6,
  "bobinaAT3":7,
  "bobinaRG1":8,
  "bobinaRG2":9,
  "bobinaRG3":10,
  "bobinaRF1":11,
  "bobinaRF2":12,
  "bobinaRF3":13,
  "ensamblajeBobinas":14,
  "corteYPlegadoPYS":15,
  "soldaduraPYS":16,
  "envioPYS":17,
  "nucleo":18,
  "montaje":19,
  "horno":20,
  "cYPTapaCuba":21,
  "tapa":22,
  "radiadoresOPaneles":23,
  "cuba":24,
  "tintasPenetrantes":25,
  "granallado":26,
  "pintura":27,
  "encubado":28,
  "ensayosRef":29,
  "terminacion":30,
  "envioADeposito":31,
  "envioACliente":32
}

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  
  date:string;
  constructor() { }
//private datePipe: DatePipe
  generateExcel(data){
    
    console.log(data)
    
    const title = 'AVANCE DE LA PRODUCCION';    
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Avance de la producción',{properties:{defaultColWidth:21}});
    let titleRow = worksheet.addRow([title]);
    
    
    
    // Set font, size and style in title row.
    titleRow.font = { name: 'Calibri', size: 20, bold: true };
    titleRow.alignment={horizontal:"center"};
    titleRow.fill={type: 'pattern',pattern: 'solid',fgColor:{ argb:"fabf8f"},bgColor:{ argb:"fabf8f"}};
    titleRow.border={
      top: {style:'medium'},
      left: {style:'medium'},
      bottom: {style:'medium'},
      right: {style:'medium'}
    }
    
    worksheet.mergeCells(1,1,2,38);
    
    
    // Blank Row
    worksheet.addRow([""]);
    // Blank Row
    worksheet.addRow([""]);
    //Add row with current date
    moment.locale('es');
    this.date=moment().format('D MMMM YYYY, h:mm:ss a');
    let actualizado=worksheet.addRow(['ACTUALIZADO A:  '+this.date]);
    actualizado.font={name: 'Calibri', size: 14, bold: true}
    worksheet.mergeCells(`A${actualizado.number}:F${actualizado.number}`);

    let columnas=worksheet.getRow(6).values = [
      'OT',
      'OP',
      'RNG',
      'LOTE',
      'POT',
      'FOT',
      'CLIENTE',
      'FPR',
      'OBS',
      'DOC',
      'BT1',
      'BT2',
      'BT3',
      'AT1',
      'AT2',
      'AT3',
      'RG1',
      'RG2',
      'RG3',
      'RF1',
      'RF2',
      'RF3',
      'ENS',
      'PY CYP ',
      'PY SOL',
      'PY ENV',
      'NUC',
      'MON',
      'HOR',
      'CUBA CYP',
      'TAPA',
      'RAD/PAN',
      'CUBA',
      'TINT',
      'GRAN',
      'PINT',
      'ENC',
      'LAB',
      'TERM',
      'DEP',
      'ENV'
    ];

    

    worksheet.getRow(6).eachCell((cell, e) => {
      cell.style={alignment:{vertical:'top',horizontal:'center'}};
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'd9d9d9' },
        bgColor: { argb: 'd9d9d9' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
      let colRow=cell.address.split(/([0-9]+)/g);
      worksheet.mergeCells(`${colRow[0]}6:${colRow[0]}7`)
    })

    
    
    worksheet.pageSetup={fitToPage:true};

    worksheet.columns = [
      {key:'oT',width:6},
      {key:'oP',width:6},
      {key:'rango',width:6},
      {key:'lote',width:5},
      {key:'potencia',width:8},
      {key:'fot',width:11},
      {key:'cliente',width:11},
      {key:'fpr',width:11},
      {key:'observaciones',width:11},
      {key:'documentacion',width:11},
      {key:'bobinaBT1',width:11},
      {key:'bobinaBT2',width:11},
      {key:'bobinaBT3',width:11},
      {key:'bobinaAT1',width:11},
      {key:'bobinaAT2',width:11},
      {key:'bobinaAT3',width:11},
      {key:'bobinaRG1',width:11},
      {key:'bobinaRG2',width:11},
      {key:'bobinaRG3',width:11},
      {key:'bobinaRF1',width:11},
      {key:'bobinaRF2',width:11},
      {key:'bobinaRF3',width:11},
      {key:'ensamblajeBobinas',width:11},
      {key:'corteYPlegadoPYS',width:11},
      {key:'soldaduraPYS',width:11},
      {key:'envioPYS',width:11},
      {key:'nucleo',width:11},
      {key:'montaje',width:11},
      {key:'horno',width:11},
      {key:'cYPTapaCuba',width:11},
      {key:'tapa',width:11},
      {key:'radiadoresOPaneles',width:11},
      {key:'cuba',width:11},
      {key:'tintasPenetrantes',width:11},
      {key:'granallado',width:11},
      {key:'pintura',width:11},
      {key:'encubado',width:11},
      {key:'ensayosRef',width:11},
      {key:'terminacion',width:11},
      {key:'envioADeposito',width:11},
      {key:'envioACliente',width:11}
      ]
    
    
    worksheet.views=[{state: 'frozen', xSplit: 9, ySplit: 0}]
      
    worksheet.addRow([" "]);
    data.forEach((e,i)=>{
      if((e.hasOwnProperty("group")))
      {
        let periodo=worksheet.addRow([`${e.group}`]);
        
        periodo.fill={type: 'pattern',pattern: 'solid',fgColor:{ argb:"f79646"},bgColor:{ argb:"f79646"}};
        periodo.font={name: 'Calibri', size: 11, bold: true};
        periodo.border={top: { style: 'thin' },bottom:{style:'thin'}};
        
      }
      else{
        let cuenta=0;
        let cuentaCol=10;
        
        worksheet.addRow({
          oT:e.oTe,
          oP:`${(e.nucleos!=null ? e.nucleos : '')}${e.oPe}`,
          rango:e.rangoInicio,
          lote:e.lote,
          potencia:e.potencia,
          fot:this.stringToDate(e.fechaPactada),
          cliente:e.nombreCli,
          fpr:this.stringToDate(e.fechaProd),
          observaciones:e.observaciones,
          documentacion:this.dateOrTime(((e.etapa.find(z=>z.idTipoEtapa==1)))),
          bobinaBT1:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==2))),
          bobinaBT2:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==3))),
          bobinaBT3:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==4))),
          bobinaAT1:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==5))),
          bobinaAT2:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==6))),
          bobinaAT3:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==7))),
          bobinaRG1:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==8))),
          bobinaRG2:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==9))),
          bobinaRG3:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==10))),
          bobinaRF1:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==11))),
          bobinaRF2:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==12))),
          bobinaRF3:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==13))),
          ensamblajeBobinas:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==14))),
          corteYPlegadoPYS:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==15))),
          soldaduraPYS:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==16))),
          envioPYS:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==17))),
          nucleo:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==18))),
          montaje:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==19))),
          horno:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==20))),
          cYPTapaCuba:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==21))),
          tapa:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==22))),
          radiadoresOPaneles:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==23))),
          cuba:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==24))),
          tintasPenetrantes:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==25))),
          granallado:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==26))),
          pintura:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==27))),
          encubado:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==28))),
          ensayosRef:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==29))),
          terminacion:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==30))),
          envioADeposito:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==31))),
          envioACliente:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==32)))
        }).eachCell({includeEmpty: true},(cell,colNumber)=>{

          let colorCortado;
          
          if(colNumber==cuentaCol)
          {
            cuentaCol++;
            cuenta++;
            if(cuentaCol<43 && (e.etapa.find(z=>z.idTipoEtapa==cuenta).idColorNavigation)!==null)
            {
              
              colorCortado=(e.etapa.find(z=>z.idTipoEtapa==cuenta).idColorNavigation.codigoColor).replace('#','');
              cell.fill={
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: `${colorCortado}` },
                bgColor: { argb: `${colorCortado}` }
              }
            }
          }
          cell.border={top: { style: 'thin', color: {argb:'000000'} }, left: { style: 'thin', color: {argb:'000000'} }, right: { style: 'thin', color: {argb:'000000'} },bottom:{style:'thin', color: {argb:'000000'}}}
          
          
        })
      }
    })

    
    
    // worksheet.mergeCellsWithoutStyle('AM1:AM200')

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'AvanceProduccion.xlsx');
    })
  }
  
  dateOrTime(etapa) : Date | string{
    
    if(etapa.dateFin==null)
    {
        if(etapa.idColor==9)
        {
          return etapa.tiempoParc;
        }
        if(etapa.idColor==1030)
        {
          if(etapa.inicioProceso == null)
          {
            return this.tiempoParcToDate(etapa.tiempoParc);
          }
          else{
            return this.dateFormat(etapa.dateIni);
          }
        }
    }
    else{
        return this.dateFormat(etapa.dateFin);
    }
  }

  stringToDate(fot) : Date{
    return new Date(fot);
  }



  dateFormat(date:string):Date{
    return new Date(date.split('T')[0]);
  }

  tiempoParcToDate(date:string):Date{
    return new Date(date.split(" ")[0]);
  }
}
