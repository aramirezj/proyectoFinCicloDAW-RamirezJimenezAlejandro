import { Afinidad } from './Afinidad';

export class Respuesta {
    constructor(
        public id: number,
        public enunciado: string,
        public madre: number,
        public afinidades: Array<Afinidad>,
        public correcta: boolean
    ) {

    }

    generaAfinidades(idR: number, cantidadSolu: number) {
        this.afinidades = [];
        for (let i = 0; i < cantidadSolu; i++) {
            let afinidad: Afinidad = new Afinidad(i, idR, i, 0);
            this.afinidades.push(afinidad);
        }
    }
}