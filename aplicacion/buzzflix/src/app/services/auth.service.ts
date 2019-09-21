import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CONFIG } from '../config/config';
import { Router } from '@angular/router'
import { Usuario } from '../modelo/Usuario';
import { NotifyService } from './notify.service';
import { RestService } from './rest.service';


@Injectable()
export class AuthService {
    constructor(
        private router: Router,
        private notifyService: NotifyService,
        private restService: RestService,
    ) {

    }

    makeId(): String {//Generación de codigos
        let text = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        return text;
    }
    getAuthUser(): Usuario {
        return JSON.parse(localStorage.getItem('usuario'))
    }

    getAuthUserId(): number {
        let user = JSON.parse(localStorage.getItem('usuario'));
        let id = user == null ? 0 : user.id;
        return id;
    }

    register(name: string, email: string, password: string): Observable<Boolean> {
        let url = `${CONFIG.apiUrl}register`;
        let body = { name: name, email: email, password: password, confirm: this.makeId() };

        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                if (!response.auth) {
                    this.notifyService.notify("Ya existe una cuenta con ese correo", "error");
                    observer.next(null)
                    return null;
                }
                observer.next(true)
                observer.complete();
                this.router.navigate(['/auth/login/waiting']);
            })
        });
    }

    login(email: string, password: string): Observable<Usuario> {
        let body = { email: email, password: password };
        let url = `${CONFIG.apiUrl}authenticate`;

        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                if (response.auth) {
                    let aux: Usuario = response.respuesta;
                    localStorage.setItem("token", response.token);
                    observer.next(aux);
                } else {
                    observer.next(null);
                    return null;
                }
                observer.complete();
            })
        });
    }

    confirmaEmail(confirmacion: String) {
        let body = { confirmacion: confirmacion };
        let url = `${CONFIG.apiUrl}confirma`;


        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                if (response.auth) {
                    let aux: Usuario = response.respuesta;
                    localStorage.setItem("token", response.token);
                    observer.next(aux);
                } else {
                    observer.next(null);
                    return null;
                }
                observer.complete();
            })
        });
    }

    getNotificaciones(): Observable<String[]> {
        let url = `${CONFIG.apiUrl}usuario/notificaciones`;

        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });
    }
    readNoti(notificacion): Observable<Boolean> {
        let url = `${CONFIG.apiUrl}usuario/read`;
        let body = { mensaje: notificacion };

        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                observer.next()
                observer.complete();
            })
        });
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
    logUserIn(aux: Usuario): void {
        console.log(aux)
        if (aux == null) {
            this.notifyService.notify("Datos incorrectos", "error");
        } else {
            localStorage.setItem("usuario", JSON.stringify(aux));
            this.notifyService.notify("Has iniciado sesión correctamente", "success");
            this.router.navigate(['/ver/todos']);
        }

    }
}
