import { Transformadores } from "./transformadores";

export interface OrderTrafo{
    id:string;
    lista:Transformadores[];
    anio:number;
    mes:number;
}