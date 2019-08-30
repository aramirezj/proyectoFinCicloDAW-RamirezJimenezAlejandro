import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { NotifyService } from './notify.service';
import { NgProgress } from 'ngx-progressbar';

export enum Tipos {
    Get,
    Post,
    Put
}

@Injectable()
export class RestService {
    tipos: typeof Tipos = Tipos;
    private headers: HttpHeaders;
    constructor(
        private http: HttpClient,
        private notifyService: NotifyService,
        private bar: NgProgress
    ) {
        this.headers = new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` });
    }
    getToken(): string {
        return localStorage.getItem('token');
    }
    setToken(): void {
        this.headers = new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` });

    }

    peticionHttp(url: string, valores?: Object, tipo?: String): Observable<any> {
        this.bar.start();
        this.setToken();
        let peticion = valores == null ?
            this.http.get(url, { observe: 'body', headers: this.headers }) :
            this.http.post(url, valores, { observe: 'body', headers: this.headers })
        peticion = tipo == "put" ? this.http.put(url, valores, { observe: 'body', headers: this.headers }) : peticion;

        return Observable.create(observer => {
            peticion.subscribe((response: any) => {
                this.bar.done();
                observer.next(response);
                observer.complete();
            }, error => {
                this.gestionError(error)
                observer.error(error);
            })
        })
    }

    gestionError(error: any) {
        this.bar.done();
        if (error.status == 500) {
            this.notifyService.notify("Error en el servidor", "error");
        } else if (error.status = 403) {
            this.notifyService.notify("Error de sesión", "err");
        }
    }



}