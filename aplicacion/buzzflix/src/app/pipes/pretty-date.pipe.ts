import { Pipe,PipeTransform } from '@angular/core';

@Pipe({
    name: 'PrettyDate'
})
export class PrettyDatePipe implements PipeTransform{
    transform(fecha:string){
        let aux =  new Date(fecha).toLocaleDateString("es-ES");
        if(aux=="Invalid Date"){
            return "Aún no conseguido";
        }else{
            return aux;
        }
    }
}