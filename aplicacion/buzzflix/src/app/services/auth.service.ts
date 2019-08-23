import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CONFIG } from '../config/config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'
import { Usuario } from '../modelo/Usuario';
import { NotifyService } from './notify.service';
import { NgProgressService } from 'ng2-progressbar';
import { FuncionesService } from './funciones.service';


@Injectable()
export class AuthService {
    private headers: HttpHeaders
    constructor(
        private http: HttpClient,
        private router: Router,
        private notifyService: NotifyService,
        private funcionesService: FuncionesService,
        private bar: NgProgressService
    ) {
        this.headers = new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` });
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

    register(name: string, email: string, password: string): Observable<Usuario> {
        this.bar.start();
        let body = { name: name, email: email, password: password };
        let url = `${CONFIG.apiUrl}register`;
        return this.http.post(url, body, { observe: 'body', headers: this.headers })
            .map((response: any) => {
                this.bar.done();
                if (response.status == "200") {
                    let aux: Usuario = new Usuario(response.id, name, email, null);
                    localStorage.setItem("token", response.token);
                    return aux;
                } else if (response.status == "Duplicate") {
                    this.notifyService.notify("Ya existe una cuenta con ese correo", "error");
                    return null;
                } else if (response.status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                    return null;
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });

    }

    login(email: string, password: string): Observable<Usuario> {
        this.bar.start();
        let body = { email: email, password: password };
        let url = `${CONFIG.apiUrl}authenticate`;
        return this.http.post(url, body, { observe: 'body', headers: this.headers })
            .map((response: any) => {
                if (response["status"] == 200) {
                    if (response.auth = "true") {
                        let aux: Usuario = response.usuario;
                        localStorage.setItem("token", response.token);
                        this.bar.done();
                        return aux;
                    } else {
                        this.bar.done();
                        return null;
                    }
                } else {
                    this.notifyService.notify("Error en el servidor", "error");
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }

    logUserIn(aux: Usuario): void {
        if (aux == null) {
            this.notifyService.notify("Datos incorrectos", "error");
        } else {
            localStorage.setItem("usuario", JSON.stringify(aux));
            this.notifyService.notify("Has iniciado sesión correctamente", "success");
            this.router.navigate(['/ver/todos']);
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

    logout(): void {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        this.notifyService.notify("Has cerrado la sesión correctamente", "success");
        this.router.navigate(['/auth/login']);
    }

    getNotificaciones(): Observable<String[]> {
        return this.http.get(`${CONFIG.apiUrl}usuario/notificaciones`, { observe: 'body', headers: this.headers })
            .map((response: any) => {
                if (response.status == "200") {
                    return response.mensajes;
                } else if (response.status == "Token invalido") {
                    this.logout();
                    return response.respuesta;
                } else if (response.status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                    return response.respuesta;
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }
    readNoti(notificacion): Observable<Boolean> {
        let url = `${CONFIG.apiUrl}usuario/read`;
        let body = { mensaje: notificacion };
        return this.http.post(url, body, { observe: 'body', headers: this.headers })
            .map((response: any) => {
                this.bar.done();
                if (response.status == "200") {
                    return true;
                } else if (response.status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                } else if (response.status == "Token invalido") {
                    this.logout();
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }
}
