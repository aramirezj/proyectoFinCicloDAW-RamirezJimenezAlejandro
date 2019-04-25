import { Respuesta } from './Respuesta'
export class Pregunta{
    constructor(
        public id:number,
        public enunciado:string,
        public respuestas:Array<Respuesta>,
        public eleccion:Respuesta
    ){
        
    }
}