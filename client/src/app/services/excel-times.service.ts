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
    
    worksheet.mergeCells(1,1,2,55);
    
    
    // Blank Row
    worksheet.addRow([""]);
    // Blank Row
    worksheet.addRow([""]);
    //Add row with current date
    moment.locale('es');
    this.date=moment().format('D MMMM YYYY, h:mm:ss a');
    let actualizado=worksheet.addRow(['ACTUALIZADO A:  '+this.date]);
    actualizado.font={name: 'Calibri', size: 14, bold: true}
    worksheet.mergeCells(`A${actualizado.number}:I${actualizado.number}`);
    

    let columnas=worksheet.getRow(6).values = [
      'PRI',
      'OT',
      'N',
      'OP',
      'RNG',
      'LOTE',
      'POT',
      'FOT',
      'CLIENTE',
      'VENDEDOR',
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
      'PATAS CYP',
      'PATAS ENV',
      'NUC',
      'MON',
      'CONEX BT',
      'CONEX AT',
      'HOR',
      'CUBA CYP',
      'RAD/PAN',
      'CUBIERTA',
      'SOLD. CUBA',
      'HERMETICIDAD',
      'GRAN. CUBA',
      'PINT. CUBA',
      'ENV. CUBA',
      'TAPA CYP',
      'SOLD. TAPA',
      'GRAN. TAPA',
      'PINT. TAPA',
      'ENV. TAPA',
      'ENC',
      'LAB',
      'CH CAR',
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
      {key:'n',width:3},
      {key:'oP',width:6},
      {key:'rango',width:6},
      {key:'lote',width:5},
      {key:'potencia',width:8},
      {key:'fot',width:11},
      {key:'cliente',width:11},
      {key:'vendedor',width:11},
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
      {key:'cYPPatas',width:11.5},
      {key:'envioPatas',width:11.5},
      {key:'nucleo',width:11.5},
      {key:'montaje',width:11.5},
      {key:'conexBT',width:11.5},
      {key:'conexAT',width:11.5},
      {key:'horno',width:11.5},
      {key:'cYPTapaCuba',width:11.5},
      {key:'radiadoresOPaneles',width:11.5},
      {key:'cubierta',width:11.5},
      {key:'cuba',width:11.5},
      {key:'tintasPenetrantes',width:11.5},
      {key:'granallado',width:11.5},
      {key:'pintura',width:11.5},
      {key:'envioCuba',width:11.5},
      {key:'cYPTapa',width:11.5},
      {key:'tapa',width:11.5},
      {key:'granalladoTapa',width:11.5},
      {key:'pinturaTapa',width:11.5},
      {key:'envioTapa',width:11.5},
      {key:'encubado',width:11.5},
      {key:'ensayosRef',width:11.5},
      {key:'ChapaDeCaracteristicas',width:11.5},
      {key:'terminacion',width:11.5},
      {key:'envioADeposito',width:11.5},
      {key:'envioACliente',width:11.5},
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
        let cuentaCol=13;
        let fot:Date|string=this.fopToDate(e.fechaPactada);
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
          n:(e.nucleos!=null) ? e.nucleos : '',
          oP:e.oPe,
          rango:e.rangoInicio,
          lote:e.lote,
          potencia:e.potencia,
          fot:this.stringToDate(e.fechaPactada),
          cliente:e.nombreCli,
          vendedor:e.idVendedorNavigation==null ? "" : e.idVendedorNavigation.nombre,
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
          cYPPatas:this.time((e.etapa.find(z=>z.idTipoEtapa==33))),
          envioPatas:this.time((e.etapa.find(z=>z.idTipoEtapa==34))),
          nucleo:this.time((e.etapa.find(z=>z.idTipoEtapa==18))),
          montaje:this.time((e.etapa.find(z=>z.idTipoEtapa==19))),
          conexBT:this.time((e.etapa.find(z=>z.idTipoEtapa==35))),
          conexAT:this.time((e.etapa.find(z=>z.idTipoEtapa==36))),
          horno:this.time((e.etapa.find(z=>z.idTipoEtapa==20))),
          cYPTapaCuba:this.time((e.etapa.find(z=>z.idTipoEtapa==21))),
          radiadoresOPaneles:this.time((e.etapa.find(z=>z.idTipoEtapa==23))),
          cubierta:this.time((e.etapa.find(z=>z.idTipoEtapa==43))),
          cuba:this.time((e.etapa.find(z=>z.idTipoEtapa==24))),
          tintasPenetrantes:this.time((e.etapa.find(z=>z.idTipoEtapa==25))),
          granallado:this.time((e.etapa.find(z=>z.idTipoEtapa==26))),
          pintura:this.time((e.etapa.find(z=>z.idTipoEtapa==27))),
          envioCuba:this.time((e.etapa.find(z=>z.idTipoEtapa==38))),
          cYPTapa:this.time((e.etapa.find(z=>z.idTipoEtapa==39))),  
          tapa:this.time((e.etapa.find(z=>z.idTipoEtapa==22))),
          granalladoTapa:this.time((e.etapa.find(z=>z.idTipoEtapa==40))),
          pinturaTapa:this.time((e.etapa.find(z=>z.idTipoEtapa==41))),
          envioTapa:this.time((e.etapa.find(z=>z.idTipoEtapa==42))),
          encubado:this.time((e.etapa.find(z=>z.idTipoEtapa==28))),
          ensayosRef:this.time((e.etapa.find(z=>z.idTipoEtapa==29))),
          chapaDeCaracteristicas:((e.etapa.find(z=>z.idTipoEtapa==44))),
          terminacion:this.time((e.etapa.find(z=>z.idTipoEtapa==30))),
          envioADeposito:this.time((e.etapa.find(z=>z.idTipoEtapa==31))),
          envioACliente:this.time((e.etapa.find(z=>z.idTipoEtapa==32)))
        }).eachCell({includeEmpty: true},(cell,colNumber)=>{

          let colorCortado;
          

          if(colNumber==11){
            if(cell!=null && fot!=null)
            {
              let fop:Date|string=this.fopToDate(cell);
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
            if(cuentaCol<=56)
            {
              let cuent;
              if(cuenta>17)
              {
                    switch(cuenta){
                      case 18:
                        cuent = 33
                        break;
                      case 19:
                        cuent = 34
                        break;
                      case 20:
                        cuent = 18
                        break;
                      case 21:
                        cuent = 19
                        break;
                      case 22:
                        cuent=35
                        break;
                      case 23:
                        cuent=36
                        break;
                      case 24:
                        cuent=20
                        break;
                      case 25:
                        cuent=21
                        break;
                      case 26:
                        cuent=23
                        break;
                      case 27:
                        cuent=43
                        break;
                      case 28:
                        cuent=24
                        break;
                      case 29:
                        cuent=25
                        break;
                      case 30:
                        cuent=26
                        break;
                      case 31:
                        cuent=27
                        break;
                      case 32:
                        cuent=38
                        break;
                      case 33:
                        cuent=39
                        break;
                      case 34:
                        cuent=22
                        break;
                      case 35:
                        cuent=40
                        break;
                      case 36:
                        cuent=41
                        break;
                      case 37:
                        cuent=42
                        break;
                      case 38:
                        cuent=28
                        break;
                      case 39:
                        cuent=29
                        break;
                      case 40:
                        cuent=44
                        break;
                      case 41:
                        cuent=30
                        break;
                      case 42:
                        cuent=31
                        break;
                      case 43:
                        cuent=32
                        break;
                    }
              }
              else{
                cuent=cuenta;
              }
              if(cuent!=37)
              {
                if((e.etapa.find(z=>z.idTipoEtapa==cuent).idColorNavigation)!==null)
                {
                  colorCortado=(e.etapa.find(z=>z.idTipoEtapa==cuent).idColorNavigation.codigoColor).replace('#','');
                  cell.fill={
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: `${colorCortado}` },
                    bgColor: { argb: `${colorCortado}` }
                  }
                }
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

  stringToDate(fot) : Date | string{

    return (fot!=null) ? new Date(fot.split('T')[0]) : '';
  }

  fopToDate(fop): Date | string{
    return (fop!=null) ? new Date(fop) : '';
  }


}
