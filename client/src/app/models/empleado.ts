import { Etapa } from './etapa';
import {EtapaEmpleado} from './etapaEmpleado';
import { Sectores } from './sectores';

export class Empleado {
    idEmpleado: string;
    nombreEmp: string;
    idSector?:number;
    idSectorNavigation?:Sectores;
    legajo:string;
}