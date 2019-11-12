import { Observable } from 'rxjs';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CONFIG } from '../config/config';
import { Router } from '@angular/router'
import { Usuario } from '../modelo/Usuario';
import { RestService } from './rest.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService as OAuth} from 'angular-6-social-login';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class AuthService {
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router,
        private restService: RestService,
        public OAuth: OAuth,
        private snackBar:MatSnackBar
    ) {

    }

    makeId(): string {//Generación de codigos
        let text = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        return text;
    }
    getAuthUser(): Usuario {
        if (isPlatformBrowser(this.platformId)) {
            return JSON.parse(localStorage.getItem('usuario'));
        }

    }

    checkNickname(nick: string): Observable<boolean> {
        let url = `${CONFIG.apiUrl}checkNickname/${nick}`;
        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });
    }

    getAuthUserId(): number {
        if (isPlatformBrowser(this.platformId)) {
            let user = JSON.parse(localStorage.getItem('usuario'));
            let id = user == null ? 0 : user.id;
            return id;
        }
    }
    getAuthUserNickname(): string {
        if (isPlatformBrowser(this.platformId)) {
            let user = JSON.parse(localStorage.getItem('usuario'));
            let nickname = user == null ? 0 : user.nickname;
            return nickname;
        }
    }

    register(name: string, nickname: string, email: string, password: string): Observable<Boolean> {
        let url = `${CONFIG.apiUrl}register`;
        let body = { name: name, nickname: nickname, email: email, password: password, confirm: this.makeId() };

        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                if (!response.auth) {
                    this.snackBar.open('Ya existe una cuenta con ese correo', "Cerrar", { duration: 4000, panelClass: 'snackBarWrong' });
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
                switch (response.auth) {
                    case 0://Datos correctos
                    this.snackBar.open('Has iniciado sesión correctamente', "Cerrar", { duration: 4000, panelClass: 'snackBarSuccess' });
                        if (isPlatformBrowser(this.platformId)) {
                            localStorage.setItem("token", response.token);
                        }
                        let aux: Usuario = response.respuesta;
                        observer.next(aux);
                        observer.complete();
                        break;
                    case 1://Datos incorrectos/no existe
                    this.snackBar.open('Datos incorrectos', "Cerrar", { duration: 3000, panelClass: 'snackBarWrong' });
                        observer.next(null);
                        break;
                    case 2://Le queda confirmar el correo
                        observer.next(null);
                        this.router.navigate(['/auth/login/waiting']);
                        break;
                }
            })
        });
    }

    confirmaEmail(confirmacion: string): Observable<Usuario> {
        let body = { confirmacion: confirmacion };
        let url = `${CONFIG.apiUrl}confirma`;
        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                if (response.auth) {
                    this.snackBar.open('Has iniciado sesión correctamente', "Cerrar", { duration: 4000, panelClass: 'snackBarSuccess' });
                    let aux: Usuario = response.respuesta;
                    if (isPlatformBrowser(this.platformId)) {
                        localStorage.setItem("token", response.token);
                    }
                    observer.next(aux);
                    observer.complete();
                } else {
                    observer.next(null);
                    observer.complete();
                }
            })
        });
    }

    forgetPassword(email: string, password: string, cod: string): Observable<Boolean> {
        let codigo = cod != null ? cod : this.makeId();
        let body = { email: email, codigo: codigo, password: password };
        let url = `${CONFIG.apiUrl}forget`;

        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                observer.next(response.final)
                observer.complete();
            })
        });

    }



    isLoggedIn(): boolean {
        let token = null;
        let usuario = null;
        if (isPlatformBrowser(this.platformId)) {
            token = localStorage.getItem("token");
            usuario = localStorage.getItem("usuario");
        }

        if (token && usuario) {
            return true
        } else {
            return false;
        }
    }

    logout(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem("usuario");
            localStorage.removeItem("token");
            localStorage.removeItem("quizCookie");
            /*this.OAuth.signOut().then(function () {
                console.log('User signed out.');
              });*/
        }
        this.snackBar.open('Has cerrado sesión correctamente', "Cerrar", { duration: 4000, panelClass: 'snackBar' });
        this.router.navigate(['/auth/login']);
    }
    logUserIn(user: Usuario): boolean {
        if (user != null) {
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem("usuario", JSON.stringify(user));
                return true;
            }

        }
        return false;
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
}
