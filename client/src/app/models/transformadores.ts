import { Etapa } from './etapa';
import { Cliente } from './cliente';

export class Transformadores{
    idTransfo:number;
    oTe:number;
    oPe:number;
    observaciones:string;
    potencia:number;
    rango:number;
    rangoInicio:number;
    rangoFin:number;
    idCliente?:number;
    nombreCli:string;
    fechaCreacion?: Date;
    idTipoTransfo?:number;
    anio:number;
    mes:number;
    prioridad:number;
    nucleos:string;
    fechaPactada:Date;
    fechaProd:Date;
    lote:number;
    radPan:string;
    etapa:Etapa[];
    idClienteNavigation:Cliente;
    

}