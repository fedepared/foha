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
    const idTipoUs=localStorage.getItem('idTipoUs');
    const title = 'AVANCE DE LA PRODUCCION';    
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Avance de la producción',{properties:{defaultColWidth:22}});
    let titleRow = worksheet.addRow([title]);
    
    
    
    idTipoUs==='6' ? worksheet.mergeCells(1,1,2,57): worksheet.mergeCells(1,1,2,56);
    
    // Set font, size and style in title row.
    worksheet.getCell('A1').font = { name: 'Calibri', size: 20, bold: true };
    worksheet.getCell('A1').alignment={horizontal:"center"};
    
    worksheet.getCell('A1').fill={type: 'pattern',pattern: 'solid',fgColor:{ argb:"fabf8f"},bgColor:{ argb:"fabf8f"}};
    worksheet.getCell('A1').border={
      top: {style:'medium'},
      left: {style:'medium'},
      bottom: {style:'medium'},
      right: {style:'medium'}
    }
    
    
    
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

    if(idTipoUs==='6'){
      let columnas=worksheet.getRow(6).values = [
        'MES',
        'PRI',
        'OT',
        'SER',
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
        // 'ENS',
        'PY CYP ',
        'PY SOL',
        'PY ENV',
        'CYP PAT',
        'PAT ENV',
        'NUC',
        'MON',
        'CON BT',
        'CON AT',
        'HOR',
        'CUBA CYP',
        'RAD/PAN',
        'CUBI',
        'SOLD. CUBA',
        'HERM',
        'GRAN. CUBA',
        'PINT. CUBA',
        'ENV. CUBA',
        'CYP TAPA',
        'SOLD. TAPA',
        'GRAN. TAPA',
        'PINT. TAPA',
        'ENV. TAPA',
        'ENC',
        'LAB',
        'CH CAR',
        'TERM',
        'APR',
        'PAGO',
        'ENV'
      ];  
    }else{
      let columnas=worksheet.getRow(6).values = [
        'MES',
        'PRI',
        'OT',
        'SER',
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
        // 'ENS',
        'PY CYP ',
        'PY SOL',
        'PY ENV',
        'CYP PAT',
        'PAT ENV',
        'NUC',
        'MON',
        'CON BT',
        'CON AT',
        'HOR',
        'CUBA CYP',
        'RAD/PAN',
        'CUBI',
        'SOLD. CUBA',
        'HERM',
        'GRAN. CUBA',
        'PINT. CUBA',
        'ENV. CUBA',
        'CYP TAPA',
        'SOLD. TAPA',
        'GRAN. TAPA',
        'PINT. TAPA',
        'ENV. TAPA',
        'ENC',
        'LAB',
        'CH CAR',
        'TERM',
        'APR',
        'ENV'
      ];
    }


    

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


    if(idTipoUs==='6'){
      
      worksheet.columns = [
        {key:'mes',width:6},
        {key:'prioridad',width:6},
        {key:'oT',width:6},
        {key:'serie',width:4},
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
        // {key:'ensamblajeBobinas',width:11.5},
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
        {key:'chapaDeCaracteristicas',width:11.5},
        {key:'terminacion',width:11.5},
        {key:'envioADeposito',width:11.5},
        {key:'pagos',width:11.5},
        {key:'envioACliente',width:11.5}
        ]
    }else{
      worksheet.columns = [
        {key:'mes',width:6},
        {key:'prioridad',width:6},
        {key:'oT',width:6},
        {key:'serie',width:4},
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
        // {key:'ensamblajeBobinas',width:11.5},
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
        {key:'chapaDeCaracteristicas',width:11.5},
        {key:'terminacion',width:11.5},
        {key:'envioADeposito',width:11.5},
        {key:'envioACliente',width:11.5},
        ]
    }
    
    
    worksheet.views=[{state: 'frozen', xSplit: 17, ySplit: 0}]
      
    worksheet.addRow([" "]);
    let iguales=false;
    let otAnterior=0;
    let loteAnterior=0;
    let row=8;
    let monthYear='';
    if(idTipoUs==='6'){
      data.forEach((e,i)=>{
        // console.log(e.idTransfo)
        
        if((e.hasOwnProperty("group")))
        {
          row--;
          let array = e.group.toString().split(' ');
          monthYear = this.monthStringToMonthNumber(array[0]) + '/' + array[2];
          // let periodo=worksheet.addRow([`${e.group}`]);
          // worksheet.mergeCells(periodo.number,1,periodo.number,55);
          // let cell=worksheet.getCell(`A${periodo.number}`);
          // cell.fill={type: 'pattern',pattern: 'solid',fgColor:{ argb:"f79646"},bgColor:{ argb:"f79646"}};
          // cell.font={name: 'Calibri', size: 11, bold: true};
          // cell.border={top: { style: 'thin' },bottom:{style:'thin'},right:{style:'thin'},left:{style:'thin'}};
          
        }
        else{
          let cuenta=0;
          let cuentaCol=15;
          let fot:Date=this.fopToDate(e.fechaPactada);
          let oTe=e.oTe;
          let lote = e.lote;
          //son del mismo grupo
          if(oTe==otAnterior && lote==loteAnterior ){
            iguales=true;
          }
          else{
            iguales=false;
            otAnterior=oTe;
            loteAnterior=lote;
          }
  
          worksheet.addRow({
            mes:monthYear,
            prioridad:e.prioridad,
            oT:e.oTe,
            serie:e.serie,
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
            // ensamblajeBobinas:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==14))),
            
            //14
            corteYPlegadoPYS:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==15))),
            //15
            soldaduraPYS:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==16))),
            //16
            envioPYS:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==17))),
            //17
            cYPPatas:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==33))),
            //18
            envioPatas:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==34))),
            //19
            nucleo:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==18))),
            //20
            montaje:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==19))),
            //21
            conexBT:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==35))),
            //22
            conexAT:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==36))),
            //23
            horno:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==20))),
            //24
            cYPTapaCuba:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==21))),
            //25
            radiadoresOPaneles:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==23))),
            //26
            cubierta:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==43))),
            //27
            cuba:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==24))),
            //28
            tintasPenetrantes:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==25))),
            //29
            granallado:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==26))),
            //30
            pintura:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==27))),
            //31
            envioCuba:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==38))),
            //32
            cYPTapa:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==39))),
            //33
            tapa:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==22))),
            //34
            granalladoTapa:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==40))),
            //35
            pinturaTapa:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==41))),
            //36
            envioTapa:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==42))),
            //37
            encubado:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==28))),
            //38
            ensayosRef:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==29))),
            //39
            chapaDeCaracteristicas:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==44))),
            //40
            terminacion:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==30))),
            //41
            envioADeposito:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==31))),
            //42
            pagos:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==45))),
            //43
            envioACliente:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==32)))
          }).eachCell({includeEmpty: true},(cell,colNumber)=>{
  
            let colorCortado;
            
  
            if(colNumber==13){
              if(cell!=null && fot!=null)
              {
                let fop:Date=this.fopToDate(cell);
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
              if(cuentaCol<=58)
              {
                let cuent;
                if(cuenta>13)
                {
                      switch(cuenta){
                        case 14:
                          cuent = 15
                          break;
                        case 15:
                          cuent = 16
                          break;
                        case 16:
                          cuent = 17
                          break;
                        case 17:
                          cuent = 33
                          break;
                        case 18:
                          cuent = 34
                          break;
                        case 19:
                          cuent = 18
                          break;
                        case 20:
                          cuent = 19
                          break;
                        case 21:
                          cuent = 35
                          break;
                        case 22:
                          cuent=36
                          break;
                        case 23:
                          cuent=20
                          break;
                        case 24:
                          cuent=21
                          break;
                        case 25:
                          cuent=23
                          break;
                        case 26:
                          cuent=43
                          break;
                        case 27:
                          cuent=24
                          break;
                        case 28:
                          cuent=25
                          break;
                        case 29:
                          cuent=26
                          break;
                        case 30:
                          cuent=27
                          break;
                        case 31:
                          cuent=38
                          break;
                        case 32:
                          cuent=39
                          break;
                        case 33:
                          cuent=22
                          break;
                        case 34:
                          cuent=40
                          break;
                        case 35:
                          cuent=41
                          break;
                        case 36:
                          cuent=42
                          break;
                        case 37:
                          cuent=28
                          break;
                        case 38:
                          cuent=29
                          break;
                        case 39:
                          cuent=44
                          break;
                        case 40:
                          cuent=30
                          break;
                        case 41:
                          cuent=31
                          break;
                        case 42:
                          cuent=45
                          break;
                        case 43:
                          cuent=32;
                          break;
                      }
                }
                else{
                  cuent=cuenta;
                }
                if(cuent != 37 && cuent !=14){
                  // console.log(cuent);
                  // console.log(e.etapa.find(z=>z.idTipoEtapa==cuent));
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
    }
    else{
      data.forEach((e,i)=>{
        // console.log(e.idTransfo)
        
        if((e.hasOwnProperty("group")))
        {
          row--;
          let array = e.group.toString().split(' ');
          monthYear = this.monthStringToMonthNumber(array[0]) + '/'+ array[2];
          // let periodo=worksheet.addRow([`${e.group}`]);

          // worksheet.mergeCells(periodo.number,1,periodo.number,54)
          // let cell=worksheet.getCell(`A${periodo.number}`);
          // cell.fill={type: 'pattern',pattern: 'solid',fgColor:{ argb:"f79646"},bgColor:{ argb:"f79646"}};
          // cell.font={name: 'Calibri', size: 11, bold: true};
          // cell.border={top: { style: 'thin' },bottom:{style:'thin'},right:{style:'thin'},left:{style:'thin'}};
          
        }
        else{
          let cuenta=0;
          let cuentaCol=15;
          let fot:Date=this.fopToDate(e.fechaPactada);
          let oTe=e.oTe;
          let lote=e.lote;
        
          //son del mismo grupo
          if(oTe==otAnterior && lote==loteAnterior){
            iguales=true;
          }
          else{
            iguales=false;
            otAnterior=oTe;
            loteAnterior=lote;
          }
          console.log(e.etapa);
          worksheet.addRow({
            mes:monthYear,
            prioridad:e.prioridad,
            oT:e.oTe,
            serie:e.serie,
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
            // ensamblajeBobinas:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==14))),
            
            //14
            corteYPlegadoPYS:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==15))),
            //15
            soldaduraPYS:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==16))),
            //16
            envioPYS:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==17))),
            //17
            cYPPatas:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==33))),
            //18
            envioPatas:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==34))),
            //19
            nucleo:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==18))),
            //20
            montaje:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==19))),
            //21
            conexBT:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==35))),
            //22
            conexAT:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==36))),
            //23
            horno:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==20))),
            //24
            cYPTapaCuba:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==21))),
            //25
            radiadoresOPaneles:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==23))),
            //26
            cubierta:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==43))),
            //27
            cuba:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==24))),
            //28
            tintasPenetrantes:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==25))),
            //29
            granallado:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==26))),
            //30
            pintura:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==27))),
            //31
            envioCuba:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==38))),
            //32
            cYPTapa:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==39))),
            //33
            tapa:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==22))),
            //34
            granalladoTapa:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==40))),
            //35
            pinturaTapa:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==41))),
            //36
            envioTapa:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==42))),
            //37
            encubado:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==28))),
            //38
            ensayosRef:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==29))),
            //39
            chapaDeCaracteristicas:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==44))),
            //40
            terminacion:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==30))),
            //41
            envioADeposito:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==31))),
            //42
            envioACliente:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==32)))
          }).eachCell({includeEmpty: true},(cell,colNumber)=>{
  
            let colorCortado;
            
  
            if(colNumber==13){
              if(cell!=null && fot!=null)
              {
                let fop:Date=this.fopToDate(cell);
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
              if(cuentaCol<=58)
              {
                let cuent;
                if(cuenta>13)
                {
                      switch(cuenta){
                        case 14:
                          cuent = 15
                          break;
                        case 15:
                          cuent = 16
                          break;
                        case 16:
                          cuent = 17
                          break;
                        case 17:
                          cuent = 33
                          break;
                        case 18:
                          cuent = 34
                          break;
                        case 19:
                          cuent = 18
                          break;
                        case 20:
                          cuent = 19
                          break;
                        case 21:
                          cuent = 35
                          break;
                        case 22:
                          cuent=36
                          break;
                        case 23:
                          cuent=20
                          break;
                        case 24:
                          cuent=21
                          break;
                        case 25:
                          cuent=23
                          break;
                        case 26:
                          cuent=43
                          break;
                        case 27:
                          cuent=24
                          break;
                        case 28:
                          cuent=25
                          break;
                        case 29:
                          cuent=26
                          break;
                        case 30:
                          cuent=27
                          break;
                        case 31:
                          cuent=38
                          break;
                        case 32:
                          cuent=39
                          break;
                        case 33:
                          cuent=22
                          break;
                        case 34:
                          cuent=40
                          break;
                        case 35:
                          cuent=41
                          break;
                        case 36:
                          cuent=42
                          break;
                        case 37:
                          cuent=28
                          break;
                        case 38:
                          cuent=29
                          break;
                        case 39:
                          cuent=44
                          break;
                        case 40:
                          cuent=30
                          break;
                        case 41:
                          cuent=31
                          break;
                        case 42:
                          cuent=32
                          break;
                      }
                }
                else{
                  cuent=cuenta;
                }
                if(cuent != 37 && cuent !=14){
                  // console.log(cuent);
                  // console.log(e.etapa.find(z=>z.idTipoEtapa==cuent));
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

    }
    

    
    
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
          if(etapa.fechaPausa==null)
          {
            return " ";
          }
          else{
            return this.dateFormat(etapa.fechaPausa)
          }
        }
        else if(etapa.idColor==1030)
        {
          if(etapa.inicioProceso == null)
          {
            return this.tiempoParcToDate(etapa.tiempoParc);
          }
          else{
            return this.dateFormat(etapa.dateIni);
          }
        }
        else{
          return " "
        }

    }
    else{
        return this.dateFormat(etapa.dateFin);
    }
  }

  stringToDate(fot) : Date | string{
    return ((fot != null) ? new Date(fot.split('T')[0]) : '');
  }

  fopToDate(fop): Date{
    return new Date(fop);
  }

  typeOfEtapa(etapa){
    return etapa.idTipoEtapa
  }

  dateFormat(date:string):Date{
    return new Date(date.split('T')[0]);
  }

  monthStringToMonthNumber(month:string){
    switch(month){
      case 'Enero': 
        return '01';
      case 'Febrero': 
        return '02';
      case 'Marzo':
        return '03';
      case 'Abril':
        return '04';
      case 'Mayo':
        return '05';
      case 'Junio':
        return '06';
      case 'Julio':
        return '07';
      case 'Agosto':
        return '08';
      case 'Septiembre':
        return '09';
      case 'Octubre':
        return '10';
      case 'Noviembre':
        return '11';
      case 'Diciembre':
        return '12';
      default:
        return month;
    }
  }

  tiempoParcToDate(date:string):Date | any{
    // console.log(new Date(parseInt(dateF[2]),parseInt(dateF[1])-1,parseInt(dateF[0])));
    if(date!=null)
    {
      const dateF = (date.split(/ |\//))
      // return new Date(date.split(" ")[0]);
      
      return new Date(parseInt(dateF[2]),parseInt(dateF[0])-1,parseInt(dateF[1]));
    }
    else{
      return "SIN DATOS"
    }
  }
}
