import { Respuesta } from './Respuesta'
export class Pregunta {
    constructor(
        public id: number,
        public enunciado: string,
        public respuestas: Array<Respuesta>,
        public eleccion: Respuesta
    ) {

    }

    generaRespuestas(cantidad: number) {
        this.respuestas = [];
        for (let i = 0; i < cantidad; i++) {
            let respuesta = new Respuesta(i, null, this.id, null, null);
            this.respuestas.push(respuesta);
        }
    }
}