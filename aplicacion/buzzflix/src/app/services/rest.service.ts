import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { NotifyService } from './notify.service';
import { NgProgress } from 'ngx-progressbar';
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';
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
        @Inject(PLATFORM_ID) private platformId: Object,
        //@Inject(LOCAL_STORAGE) private localStorage: any, 
        private http: HttpClient,
        private notifyService: NotifyService,
        private bar: NgProgress,
        private router: Router
    ) {
        this.headers = new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` });
    }
    getToken(): String {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('token');
        }
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
        } else if (error.status == 403) {
            this.notifyService.notify("Error de sesión", "error");
            if (isPlatformBrowser(this.platformId)) {
                localStorage.removeItem("usuario");
                localStorage.removeItem("token");
            }

            this.router.navigate(['/auth/login']);
        } else if (error.status == 422) {
            this.notifyService.notify("Hubo un error, comprueba que todos los campos son validos", "error");
        }
    }



}