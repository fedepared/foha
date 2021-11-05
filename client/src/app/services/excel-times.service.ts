import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';
import { Transformadores } from '../models/transformadores';

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
export class ExcelTimesService {
  
  date:string;
  constructor() { }
//private datePipe: DatePipe
  generateExcel(data){
    
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
      'PRI',
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
      {key:'prioridad',width:6},
      {key:'oT',width:6},
      {key:'oP',width:6},
      {key:'rango',width:6},
      {key:'lote',width:5},
      {key:'potencia',width:8},
      {key:'fot',width:11},
      {key:'cliente',width:11},
      {key:'fpr',width:11},
      {key:'observaciones',width:11},
      {key:'documentacion',width:11.5},
      {key:'bobinaBT1',width:11.5},
      {key:'bobinaBT2',width:11.5},
      {key:'bobinaBT3',width:11.5},
      {key:'bobinaAT1',width:11.5},
      {key:'bobinaAT2',width:11.5},
      {key:'bobinaAT3',width:11.5},
      {key:'bobinaRG1',width:11.5},
      {key:'bobinaRG2',width:11.5},
      {key:'bobinaRG3',width:11.5},
      {key:'bobinaRF1',width:11.5},
      {key:'bobinaRF2',width:11.5},
      {key:'bobinaRF3',width:11.5},
      {key:'ensamblajeBobinas',width:11.5},
      {key:'corteYPlegadoPYS',width:11.5},
      {key:'soldaduraPYS',width:11.5},
      {key:'envioPYS',width:11.5},
      {key:'nucleo',width:11.5},
      {key:'montaje',width:11.5},
      {key:'horno',width:11.5},
      {key:'cYPTapaCuba',width:11.5},
      {key:'tapa',width:11.5},
      {key:'radiadoresOPaneles',width:11.5},
      {key:'cuba',width:11.5},
      {key:'tintasPenetrantes',width:11.5},
      {key:'granallado',width:11.5},
      {key:'pintura',width:11.5},
      {key:'encubado',width:11.5},
      {key:'ensayosRef',width:11.5},
      {key:'terminacion',width:11.5},
      {key:'envioADeposito',width:11.5},
      {key:'envioACliente',width:11.5}
      ]
    
    
    worksheet.views=[{state: 'frozen', xSplit: 17, ySplit: 0}]
      
    worksheet.addRow([" "]);
    let iguales=false;
    let otAnterior=0;
    let row=9;
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
        let cuentaCol=11;
        let fot:Date=this.fopToDate(e.fechaPactada);
        let oTe=e.oTe
        //son del mismo grupo
        if(oTe==otAnterior){
          iguales=true;
        }
        else{
          iguales=false;
          otAnterior=oTe;
        }
        worksheet.addRow({
          prioridad:e.prioridad,
          oT:e.oTe,
          oP:`${(e.nucleos!=null ? e.nucleos : '')}${e.oPe}`,
          rango:e.rangoInicio,
          lote:e.lote,
          potencia:e.potencia,
          fot:this.stringToDate(e.fechaPactada),
          cliente:e.nombreCli,
          fpr:this.stringToDate(e.fechaProd),
          observaciones:e.observaciones,
          documentacion:this.time(((e.etapa.find(z=>z.idTipoEtapa==1)))),
          bobinaBT1:this.time((e.etapa.find(z=>z.idTipoEtapa==2))),
          bobinaBT2:this.time((e.etapa.find(z=>z.idTipoEtapa==3))),
          bobinaBT3:this.time((e.etapa.find(z=>z.idTipoEtapa==4))),
          bobinaAT1:this.time((e.etapa.find(z=>z.idTipoEtapa==5))),
          bobinaAT2:this.time((e.etapa.find(z=>z.idTipoEtapa==6))),
          bobinaAT3:this.time((e.etapa.find(z=>z.idTipoEtapa==7))),
          bobinaRG1:this.time((e.etapa.find(z=>z.idTipoEtapa==8))),
          bobinaRG2:this.time((e.etapa.find(z=>z.idTipoEtapa==9))),
          bobinaRG3:this.time((e.etapa.find(z=>z.idTipoEtapa==10))),
          bobinaRF1:this.time((e.etapa.find(z=>z.idTipoEtapa==11))),
          bobinaRF2:this.time((e.etapa.find(z=>z.idTipoEtapa==12))),
          bobinaRF3:this.time((e.etapa.find(z=>z.idTipoEtapa==13))),
          ensamblajeBobinas:this.time((e.etapa.find(z=>z.idTipoEtapa==14))),
          corteYPlegadoPYS:this.time((e.etapa.find(z=>z.idTipoEtapa==15))),
          soldaduraPYS:this.time((e.etapa.find(z=>z.idTipoEtapa==16))),
          envioPYS:this.time((e.etapa.find(z=>z.idTipoEtapa==17))),
          nucleo:this.time((e.etapa.find(z=>z.idTipoEtapa==18))),
          montaje:this.time((e.etapa.find(z=>z.idTipoEtapa==19))),
          horno:this.time((e.etapa.find(z=>z.idTipoEtapa==20))),
          cYPTapaCuba:this.time((e.etapa.find(z=>z.idTipoEtapa==21))),
          tapa:this.time((e.etapa.find(z=>z.idTipoEtapa==22))),
          radiadoresOPaneles:this.time((e.etapa.find(z=>z.idTipoEtapa==23))),
          cuba:this.time((e.etapa.find(z=>z.idTipoEtapa==24))),
          tintasPenetrantes:this.time((e.etapa.find(z=>z.idTipoEtapa==25))),
          granallado:this.time((e.etapa.find(z=>z.idTipoEtapa==26))),
          pintura:this.time((e.etapa.find(z=>z.idTipoEtapa==27))),
          encubado:this.time((e.etapa.find(z=>z.idTipoEtapa==28))),
          ensayosRef:this.time((e.etapa.find(z=>z.idTipoEtapa==29))),
          terminacion:this.time((e.etapa.find(z=>z.idTipoEtapa==30))),
          envioADeposito:this.time((e.etapa.find(z=>z.idTipoEtapa==31))),
          envioACliente:this.time((e.etapa.find(z=>z.idTipoEtapa==32)))
        }).eachCell({includeEmpty: true},(cell,colNumber)=>{

          let colorCortado;
          

          if(colNumber==9){
            if(cell!=null && fot!=null)
            {
              let fop:Date=this.fopToDate(cell);
              // console.log(fot);
              // console.log(fop)
              if(fot<fop)
              {
                cell.fill={
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: "b22222" },
                  bgColor: { argb: "b22222"},

                }
                cell.font={
                  color: {argb:'ffffff'}
                }
              }
            }
          }

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
        if(iguales==true){
          worksheet.getRow(row).outlineLevel=1;
        }
        else{
          worksheet.getRow(row).outlineLevel=0;
        }
      }
      row++;
    })
    

    
    // worksheet.mergeCellsWithoutStyle('AM1:AM200')

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'AvanceProduccionTiempos.xlsx');
    })
  }
  
  time(etapa) : string{
      
      //iniciado
      if(etapa.idColor==1030){
        
        return " "
      }
      //pausado
      else if(etapa.idColor==9)
      {
        if(etapa.tiempoParc!=null)
        {
          return etapa.tiempoParc
        }
        else{
          return "No medido"
        }
      }else if(etapa.idColor==10){
        if(etapa.tiempoFin==null)
        {
          return "No Medido"
        }
        else{
          return etapa.tiempoFin
        }
      }else{
        return " "
      }

    
  }

  stringToDate(fot) : Date{
    return new Date(fot.split('T')[0]);
  }

  fopToDate(fop): Date{
    return new Date(fop);
  }


}
