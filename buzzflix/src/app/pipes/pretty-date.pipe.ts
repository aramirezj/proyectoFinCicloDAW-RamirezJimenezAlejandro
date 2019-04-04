import { Pipe,PipeTransform } from '@angular/core';

@Pipe({
    name: 'PrettyDate'
})
export class PrettyDatePipe implements PipeTransform{
    transform(fecha:string){
        return new Date(fecha).toLocaleDateString("es-ES");
    }
}