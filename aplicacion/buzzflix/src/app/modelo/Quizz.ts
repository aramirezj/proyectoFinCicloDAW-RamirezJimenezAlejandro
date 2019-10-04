import { Pregunta } from './Pregunta'
import { Solucion } from './Solucion';
export class Quizz{
    constructor(
        public id:number,
        public creador:number,
        public nickname:string,
        public titulo:string,
        public image:string,
        public soluciones:Array<Solucion>,
        public preguntas:Array<Pregunta>,
        public estrellas:number,
        public fechacreacion:Date
        
    ){
        
    }
}