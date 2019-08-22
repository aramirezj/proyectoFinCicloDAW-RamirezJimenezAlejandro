import { Observable } from 'rxjs';
import { Injectable, ɵConsole } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from './../config/config';
import { NgProgressService } from 'ng2-progressbar';
import { Quizz } from '../modelo/Quizz';
import { DatePipe } from '@angular/common';
import { UserService } from './user.service';
import { NotifyService } from './notify.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
@Injectable()
export class QuizzService {
    private headers: HttpHeaders
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private http: HttpClient,
        private bar: NgProgressService,
        private notifyService: NotifyService,
        private firestore: AngularFirestore,
        private afStorage: AngularFireStorage
    ) {
        this.headers = new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` });
    }

    getToken(): string {
        return localStorage.getItem('token');
    }

    votaQuizz(quizz: number | string, n: number): Observable<void> {
        this.bar.start();
        let id = this.authService.getAuthUserId();
        let url = `${CONFIG.apiUrl}vota`;
        let body = { origen: id, quizz: quizz, cantidad: n };
        return this.http.post(url, body, { observe: 'body', headers: this.headers })
            .map((response: any) => {
                this.bar.done();
                if (response.status == "200") {
                    this.notifyService.notify("Has votado correctamente, ¡Gracias!", "success");
                } else if (response.status == "Usuario sin permiso") {
                    this.notifyService.notify("No tienes permiso", "error");
                } else if (response.status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                } else if (response.status == "Token invalido") {
                    this.authService.logout();
                } else {
                    this.notifyService.notify("Error desconocido", "error");
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }

    getCantidad(id: number): Observable<number> {
        return this.http.get(`${CONFIG.apiUrl}quizz/${id}/cantidad`, { observe: 'body', headers: this.headers })
            .map((response: any) => {
                return response.resultado;
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }

    getMedia(id: number): Observable<number> {
        return this.http.get(`${CONFIG.apiUrl}quizz/${id}/media`, { observe: 'body', headers: this.headers })
        .map((response: any) => {
                return response.resultado;
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }

    createQuizz(quizz: Quizz, files: File[], privado: string): Observable<any> {
        this.bar.start();
        let id = this.authService.getAuthUserId();
        let fecha = new Date();
        let url = `${CONFIG.apiUrl}creaQuizz`;
        quizz.fechacreacion = fecha;
        quizz.creador = id;
        let prep = JSON.stringify(quizz);
        let body = { creador: this.authService.getAuthUserId(), titulo: quizz.titulo, contenido: prep, fecha: fecha, privado: privado };
        return this.http.post(url, body, { observe: 'body', headers: this.headers })
        .map((response: any) => {
                this.uploadImage(files);
                this.bar.done();
                return response;
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }

    uploadImage(files): void {
        for (let i = 0; i < files.length; i++) {
            let ref = this.afStorage.ref(files[i].name);
            ref.put(files[i]);
        }
    }



    obtenerQuizzSeguidos(inicio: number, fin: number): Observable<Array<Quizz>> {
        let id = this.authService.getAuthUserId();
        let cadena = inicio + "-" + fin;
        return this.http.get(`${CONFIG.apiUrl}quizz/${id}/seguidos/${cadena}`,{ observe: 'body', headers: this.headers })
        .map((response: any) => {
                if (response.status == "200") {
                    return response;
                } else if (response.status == "Usuario sin permiso") {
                    this.notifyService.notify("No tienes permiso", "error");
                } else if (response.status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                } else {
                    this.authService.logout();
                    return null;
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });

    }
    obtenerAllQuizz(inicio: number, fin: number): Observable<Array<Quizz>> {
        let id = this.authService.getAuthUserId();
        let cadena = inicio + "-" + fin;
        return this.http.get(`${CONFIG.apiUrl}quizz/todos/${cadena}`,{ observe: 'body', headers: this.headers })
            .map((response: any) => {
                if (response.status == 'OK') {
                    return response;
                } else {
                    return null;
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });

    }

    getQuizz(id: string): Observable<Quizz> {
        return this.http.get(`${CONFIG.apiUrl}quizz/${id}`,{ observe: 'body', headers: this.headers })
            .map((response: any) => {
                if (response.status == 'OK') {
                    let rawquiz = response.cont[0];
                    let quiz = JSON.parse(rawquiz.contenido);
                    quiz.id = rawquiz.id;
                    return quiz;
                } else {
                    return null;
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }
    getQuizzes(nombre: string): Observable<Array<Quizz>> {
        return this.http.get(`${CONFIG.apiUrl}quizzes/${nombre}`,{ observe: 'body', headers: this.headers })
            .map((response: any) => {
                if (response.status == '200') {
                    return response.quizzes;
                } else {
                    return null;
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });

    }



    borraQuizz(quizz: Quizz) {
        this.bar.start();
        let url = `${CONFIG.apiUrl}borraQuizz`;
        let body = { quizz: quizz.id };
        return this.http.post(url, body,{ observe: 'body', headers: this.headers })
            .map((response: any) => {
                this.bar.done();
                if (response.status == "200") {
                    this.notifyService.notify("Has borrado tu quizz correctamente, una gran perdida...", "success");
                    this.deleteImages(quizz);
                    location.reload();
                } else if (response.status == "Usuario sin permiso") {
                    this.notifyService.notify("No tienes permiso", "error");
                } else if (response.status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                } else {
                    this.authService.logout();
                    return null;
                }
                return response;
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }

    deleteImages(quizz: Quizz):void {
        let files: string[] = [];
        files.push(quizz.image);
        for (let i = 0; i < quizz.soluciones.length; i++) {
            files.push(quizz.soluciones[i].image);
        }
        for (let j = 0; j < files.length; j++) {
            this.afStorage.ref(files[j]).delete();
        }
    }

    listaModeracion(): Observable<Array<Quizz>> {
        let id = this.authService.getAuthUserId();
        let url = `${CONFIG.apiUrl}quizz/moderacion`;
        let body = { id: id };
        return this.http.post(url, body,{ observe: 'body', headers: this.headers })
            .map((response: any) => {
                if (response.status == '200') {
                    return response.cont;
                } else {
                    return null;
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }

    moderaQuizz(id: number, accion: boolean) { //PROTEGIDO
        let url = `${CONFIG.apiUrl}modera`;
        let body = { quizz: id, usuario: this.authService.getAuthUserId(), decision: accion };
        return this.http.post(url, body,{ observe: 'body', headers: this.headers })
            .map((response: any) => {
                this.bar.done();
                if (response.status == "200") {
                    this.notifyService.notify("Acción registrada", "success");
                    return true;
                } else if (response.status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                } else {
                    this.authService.logout();
                    return null;
                }
                return response;
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }
    cambiaTipo(quiz: Quizz, privado: boolean) {
        this.bar.start();
        let url = `${CONFIG.apiUrl}cambiaTipo`;
        var text
        if (privado) {
            text = Math.random().toString(36).substring(2);
        } else {
            text = null;
        }
        let body = { quizz: quiz.id, privado: text };
        return this.http.post(url, body,{ observe: 'body', headers: this.headers })
            .map((response: any) => {
                this.bar.done();
                if (response.status == '200') {
                    location.reload();
                } else if (response.status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                    return null;
                } else {
                    this.authService.logout();
                    return null;
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }


}