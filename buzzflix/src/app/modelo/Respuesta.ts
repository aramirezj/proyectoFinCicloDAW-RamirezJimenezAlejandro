import { Afinidad } from './Afinidad';

export class Respuesta{
    constructor(
        public id:number,
        public enunciado:string,
        public madre:number,
        public afinidades:Array<Afinidad>
    ){
        
    }
}