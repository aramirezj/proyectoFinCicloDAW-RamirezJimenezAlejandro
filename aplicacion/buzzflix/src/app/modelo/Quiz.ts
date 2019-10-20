import { Pregunta } from './Pregunta'
import { Solucion } from './Solucion';

export class Quiz{
    constructor(
        public id:number,
        public creador:number,
        public nickname:string,
        public titulo:string,
        public image:string,
        public soluciones:Array<Solucion>,
        public preguntas:Array<Pregunta>,
        public estrellas:number,
        public fechacreacion:Date,
        public tipo:number
        
    ){
        
    }
    generaPreguntas(cantidad: number) {
        this.preguntas = [];
        for (let i = 0; i < cantidad; i++) {
            let pregunta: Pregunta = new Pregunta(i, null, null, null);
            this.preguntas.push(pregunta);
        }
    }

    generaSoluciones() {
        let solucion: Solucion = new Solucion(0, null,null,null, 0);
        let solucion2: Solucion = new Solucion(1, null,null,null, 25);
        let solucion3: Solucion = new Solucion(2, null,null,null, 50);
        let solucion4: Solucion = new Solucion(3, null,null,null, 75);
        let solucion5: Solucion = new Solucion(4, null,null,null, 100);
        this.soluciones = [solucion, solucion2, solucion3, solucion4, solucion5];
    }
}