import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { EtapaService } from '../services/etapa.service';

const MAP_NOMBRE_ETAPA: { [tipoEtapa: string]: number} = {
  "DOC":1,    
  "BT1":2,
  "BT2":3,
  "BT3":4,
  "AT1":5,
  "AT2":6,
  "AT3":7,
  "RG1":8,
  "RG2":9,      
  "RG3":10,
  "RF1":11,
  "RF2":12,
  "RF3":13,
  "ENS":14,
  "PY CYP":15,
  "PY SOL":16,
  "PY ENV":17,
  "NUC":18,
  "MON":19,
  "HOR":20,
  "CUBA CYP":21,
  "SOL TAPA":22,
  "RAD/PAN":23,
  "SOL CUBA":24,
  "HERM":25,
  "GRAN CUBA":26,
  "PINT CUBA":27,
  "ENC":28,
  "LAB":29,
  "TERM":30,
  "DEP":31,
  "ENV":32,
  "CON BT":35,
  "CON AT":36,
  "REL TRANSF":37,
  "ENV CUBA":38,
  "CYP TAPA":39,
  "GRAN TAPA":40,
  "PINT TAPA":41,
  "ENV TAPA":42,
  "CUBI":43
}

@Component({
  selector: 'app-modify-proc-number',
  templateUrl: './modify-proc-number.component.html',
  styleUrls: ['./modify-proc-number.component.css']
})
export class ModifyProcNumberComponent implements OnInit {
  
  oldNum:number=null;
  newNum:number=null;
  displayedColumns=['edit','processType','ot','op','potencia','status']   
  processes=[];
  selectedProcess: any;

  constructor(private etapaService:EtapaService) { }

  ngOnInit(): void {
  }
  
  searchProcess(oldNum){
    console.log(oldNum);
    this.etapaService.getEtapaByProcNum(oldNum).subscribe(res => {
      if(res)
      {
        this.processes=res;
        for(let a of this.processes)
        {
          a.idTipoEtapa=Object.keys(MAP_NOMBRE_ETAPA).find(key => MAP_NOMBRE_ETAPA[key] === a.idTipoEtapa); 
        }
      }
    })
  }

  selectProcess(process)
  {
    this.selectedProcess=process;
    console.log(this.selectedProcess)
  }

  modifyProcess(newNum)
  {
    console.log(this.selectedProcess.idEtapa);
    this.etapaService.updateProcNum(this.selectedProcess.idEtapa,newNum).subscribe(res => {
      if(res)
      {
        this.newNum=null;
      }
    })
  }
}
