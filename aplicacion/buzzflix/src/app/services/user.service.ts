import { Observable } from 'rxjs';
import { Injectable, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth.service';
import { CONFIG } from './../config/config';
import { Usuario } from '../modelo/Usuario';
import { NgProgress } from 'ngx-progressbar';
import { Quizz } from '../modelo/Quizz';
import { NotifyService } from './notify.service';

import { finalize } from 'rxjs/operators';
import { Logro } from '../modelo/Logro';
import { BehaviorSubject } from 'rxjs';
import { RestService } from './rest.service';
import { isPlatformBrowser } from '@angular/common';
import { FileService } from './file.service';
@Injectable()
export class UserService {
    public idPaquete = new BehaviorSubject(0);
    currentMessage = this.idPaquete.asObservable();
    public userProfileUpdated: EventEmitter<Usuario>
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private authService: AuthService,
        private bar: NgProgress,
        private notifyService: NotifyService,
        private restService: RestService,
        private fileService:FileService
    ) {
        this.userProfileUpdated = new EventEmitter();
    }
    changeMessage(id: number): void {
        this.idPaquete.next(id)
    }

    isAdmin(): Observable<boolean> {
        let url = `${CONFIG.apiUrl}usuario/admin`;
        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });

    }

    reportarUsuario(destino: number): Observable<void> {
        let url = `${CONFIG.apiUrl}reportar`;
        let body = { origen: this.authService.getAuthUserId(), destino: destino, motivo: "perfil" };

        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });
    }

    getUserWall(nickname: string): Observable<Array<Quizz>> {
        let url = `${CONFIG.apiUrl}usuario/${nickname}/wall`;
        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });
    }   
    getLogros(nick: string): Observable<Array<Logro>> {
        let url = `${CONFIG.apiUrl}usuario/${nick}/logros`;
        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });
    }
    getUserStats(id: number): Observable<number> {
        let url = `${CONFIG.apiUrl}usuario/stats`;
        let body = { origen: this.authService.getAuthUserId(), destino: id };

        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });
    }

    getUserByNickname(nickname: string): Observable<Usuario> {  //PROTEGIDO
        let url = `${CONFIG.apiUrl}usuario/${nickname}`;

        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });

    }
    getUsuarios(nombre: string): Observable<Array<Usuario>> {  //PROTEGIDO
        let url = `${CONFIG.apiUrl}usuarios/${nombre}`;
        nombre = nombre == "" ? "EVERYTHINGPLEASE" : nombre;

        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });
    }

    updateProfile(datos: any): Observable<Usuario> { //PROTECTED
        const OLDUSUARIO = this.authService.getAuthUser();
        let id = +this.authService.getAuthUserId();
        let file = datos["file"];
        let avatar = file != undefined ? file.name : OLDUSUARIO.avatar;

        if (datos["nombre"] == undefined) {
            datos["nombre"] = OLDUSUARIO.name;
        }
        if (datos["nickname"] == undefined) {
            datos["nickname"] = OLDUSUARIO.nickname;
        }

        let url = `${CONFIG.apiUrl}usuario/actualizar/${id}`;
        let body = {
            name: datos["nombre"],
            nickname: datos["nickname"],
            oldpass: datos["oldpass"],
            newpass: datos["newpass"],
            avatar: avatar
        };
        return Observable.create(observer => {
            this.restService.peticionHttp(url, body, "put").subscribe(response => {
                this.bar.done();
                if (response.status == "Wrong password") {
                    this.notifyService.notify("La contraseña antigua es erronea.", "error");
                    return this.authService.getAuthUser();
                }

                let aux = this.authService.getAuthUser();
                aux.name = datos["nombre"];
                aux.nickname = datos["nickname"];
                aux.avatar = avatar;
                if (isPlatformBrowser(this.platformId)) {
                    localStorage.setItem("usuario", JSON.stringify(aux));
                }

                if (file != undefined) {
                    let ref = this.fileService.obtenerReferencia(avatar);
                    const uploadTask = ref.put(file);
                    uploadTask.snapshotChanges().pipe(
                        finalize(() => {
                            if (datos["oldfile"] != undefined && datos["oldfile"] != "") {
                                if (OLDUSUARIO.avatar != null) {
                                    this.borraImagen(OLDUSUARIO.avatar);
                                }

                            }
                            this.notifyService.notify("¡Usuario actualizado con exito!", "success");
                            this.userProfileUpdated.emit(aux);
                            return aux;
                        })
                    ).subscribe()
                } else {
                    this.notifyService.notify("¡Usuario actualizado con exito!", "success");
                    this.userProfileUpdated.emit(aux);
                    return aux;
                }
                //observer.next(response.respuesta)
                observer.complete();
            })
        });
    }
    borraImagen(avatar: string): void {
        this.fileService.deleteImg(avatar);
    }

}