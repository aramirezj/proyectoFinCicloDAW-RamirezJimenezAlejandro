import { Observable } from 'rxjs';
import { Injectable, ɵConsole } from '@angular/core';
import { CONFIG } from '../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router'
import { Usuario } from '../modelo/Usuario';
import { NotifyService } from './notify.service';
import { NgProgressService } from 'ng2-progressbar';
/*import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';*/


@Injectable()
export class AuthService {
    private headers: Headers
    constructor(
        private http: Http,
        private router: Router,
        private notifyService: NotifyService,
        private bar: NgProgressService
    ) {
        this.headers = new Headers({ 'Authorization': `Bearer ${this.getToken()}` });
    }
    getToken(): string {
        return localStorage.getItem('token');
    }
    getAuthUser(): Usuario {
        return JSON.parse(localStorage.getItem('usuario'))
    }

    getAuthUserId(): number {
        return JSON.parse(localStorage.getItem('usuario')).id
    }

    register(name: string, email: string, password: string): Promise<Usuario> {
        this.bar.start();
        console.log("Llego a la peticion" + name + "-" + email + "-" + password);
        return this.http.post(`${CONFIG.apiUrl}register`, { name: name, email: email, password: password })
            .toPromise()
            .then((response) => {
                this.bar.done();
                if (response.json().status == "200") {
                    let aux: Usuario = new Usuario(response.json().id, name, email, null);
                    localStorage.setItem("token", response.json().token);
                    return aux;
                } else if (response.json().status == "Duplicate") {
                    this.notifyService.notify("Ya existe una cuenta con ese correo", "error");
                    return null;
                } else if (response.json().status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                    return null;
                }



            })
    }

    login(email: string, password: string): Promise<Usuario> {
        this.bar.start();
        return this.http.post(`${CONFIG.apiUrl}authenticate`, { email: email, password: password })
            .toPromise()
            .then((response) => {
                if (response.status == 200) {
                    let aux: Usuario = response.json().usuario;
                    localStorage.setItem("token", response.json().token);
                    this.bar.done();
                    return aux;
                } else {
                    this.bar.done();
                    return null;
                }

            })
    }

    logUserIn(aux: Usuario): void {
        if (aux == null) {
            this.notifyService.notify("Datos incorrectos", "error");
        } else {
            localStorage.setItem("usuario", JSON.stringify(aux));
            this.notifyService.notify("Has iniciado sesión correctamente", "success");
            this.router.navigate(['/ver/todos']);
            //location.reload();
        }

    }

    isLoggedIn(): boolean {
        let usuario = localStorage.getItem("usuario");
        let token = localStorage.getItem("token");
        if (usuario && token) {
            return true
        } else {
            return false;
        }
    }

    logout() {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        this.notifyService.notify("Has cerrado la sesión correctamente", "success");
        this.router.navigate(['/auth/login']);
    }

    getNotificaciones(): Promise<string[]> {
        this.headers = new Headers({ 'Authorization': `Bearer ${this.getToken()}` });
        let options = new RequestOptions({ headers: this.headers });
        return this.http.get(`${CONFIG.apiUrl}usuario/notificaciones`, options)
            .toPromise()
            .then((response) => {
                if (response.json().status == "200") {
                    return response.json().mensajes;
                } else if (response.json().status == "Token invalido") {
                    this.logout();
                    return response.json().respuesta;
                } else if (response.json().status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                    return response.json().respuesta;
                }
            });
    }
    readNoti(notificacion): Promise<Boolean> {
        let url = `${CONFIG.apiUrl}usuario/read`;
        let body = { mensaje: notificacion };
        let options = new RequestOptions({ headers: this.headers });
        return this.http.post(url, body, options)
            .toPromise()
            .then(resp => {
                this.bar.done();
                if (resp.json().status == "200") {
                    return true;
                } else if (resp.json().status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                } else if (resp.json().status == "Token invalido") {
                    this.logout();
                }
            })
    }
}
