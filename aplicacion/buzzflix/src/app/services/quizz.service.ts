import { Observable } from 'rxjs';
import { Injectable, ɵConsole } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CONFIG } from './../config/config';
import { NgProgressService } from 'ng2-progressbar';
import { Quizz } from '../modelo/Quizz';
import { DatePipe } from '@angular/common';
import { UserService } from './user.service';
import { NotifyService } from './notify.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
@Injectable()
export class QuizzService {
    private headers: Headers
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private http: Http,
        private bar: NgProgressService,
        private notifyService: NotifyService,
        private firestore: AngularFirestore,
        private afStorage: AngularFireStorage
    ) {
        this.headers = new Headers({ 'Authorization': `Bearer ${this.getToken()}` });
    }




    getToken(): string {
        return localStorage.getItem('token');
    }

    votaQuizz(quizz: number, n: number) {
        this.bar.start();
        let id = this.authService.getAuthUserId();
        let fecha = new Date();
        let url = `${CONFIG.apiUrl}vota`;
        let body = { origen: id, quizz: quizz, cantidad: n };
        let options = new RequestOptions({ headers: this.headers });
        return this.http.post(url, body, options)
            .toPromise()
            .then(resp => {
                this.bar.done();
                if (resp.json().status == "200") {
                    this.notifyService.notify("Has votado correctamente, ¡Gracias!", "success");
                } else if (resp.json().status == "Usuario sin permiso") {
                    this.notifyService.notify("No tienes permiso", "error");
                } else if (resp.json().status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                } else if(resp.json().status == "Token invalido"){
                    this.authService.logout();
                }else{
                    this.notifyService.notify("Error desconocido", "error");
                }

                return resp.json();
            })
    }

    getCantidad(id: number): Promise<number> {
        return this.http.get(`${CONFIG.apiUrl}quizz/${id}/cantidad`)
            .toPromise()
            .then(resp => {
                return resp.json().resultado;
            })
            .catch(function (e) {
                console.log("Error ", e)
            })
    }

    getMedia(id: number): Promise<number> {
        return this.http.get(`${CONFIG.apiUrl}quizz/${id}/media`)
            .toPromise()
            .then(resp => {
                return resp.json().resultado;
            })
            .catch(function (e) {
                console.log("Error ", e)
            })
    }

    createQuizz(quizz: Quizz, files: File[]): Promise<any> {
        this.bar.start();
        let id = this.authService.getAuthUserId();
        let fecha = new Date();
        let url = `${CONFIG.apiUrl}creaQuizz`;
        quizz.fechacreacion = fecha;
        quizz.creador = id;
        let prep = JSON.stringify(quizz);
        let body = { creador: this.authService.getAuthUserId(), titulo: quizz.titulo, contenido: prep, fecha: fecha };
        console.log(body);
        let options = new RequestOptions({ headers: this.headers });
        return this.http.post(url, body, options)
            .toPromise()
            .then(resp => {
                this.uploadImage(files);
                this.bar.done();
                return resp.json();
            })
    }

    uploadImage(files) {
        for (let i = 0; i < files.length; i++) {
            let ref = this.afStorage.ref(files[i].name);
            ref.put(files[i]);
        }
    }

    
    obtenerQuizzSeguidos(): Promise<Array<Quizz>> {
        this.headers = new Headers({ 'Authorization': `Bearer ${this.getToken()}` });
        let id = this.authService.getAuthUserId();
        return this.http.get(`${CONFIG.apiUrl}quizz/${id}/seguidos`)
            .toPromise()
            .then(resp => {
                if (resp.json().status == "200") {
                    return resp.json().cont;
                } else if (resp.json().status == "Usuario sin permiso") {
                    this.notifyService.notify("No tienes permiso", "error");
                } else if (resp.json().status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                } else {
                    this.authService.logout();
                    return null;
                }
            })
            .catch(function (e) {
                console.log("Error ", e)
            })

    }
    obtenerAllQuizz(): Promise<Array<Quizz>> {
        let id = this.authService.getAuthUserId();
        return this.http.get(`${CONFIG.apiUrl}quizz/todos`)
            .toPromise()
            .then(resp => {
                if (resp.json().status == 'OK') {
                    return resp.json().cont;
                } else {
                    return null;
                }
            })
            .catch(function (e) {
                console.log("Error ", e)
            })

    }

    getQuizz(id: number): Promise<Quizz> {
        return this.http.get(`${CONFIG.apiUrl}quizz/${id}`)
            .toPromise()
            .then(resp => {
                if (resp.json().status == 'OK') {
                    let aux = resp.json();
                    return JSON.parse(aux.cont[0].contenido);
                } else {
                    return null;
                }
            })
            .catch(function (e) {
                console.log("Error ", e)
            })
    }
    getQuizzes(nombre:string): Promise<Array<Quizz>> {
        return this.http.get(`${CONFIG.apiUrl}quizzes/${nombre}`)
            .toPromise()
            .then(resp => {
                if (resp.json().status == '200') {
                    return resp.json().quizzes;
                } else {
                    return null;
                }
            })
            .catch(function (e) {
                console.log("Error ", e)
            })

    }

    

    borraQuizz(quizz: Quizz) {
        this.bar.start();
        let url = `${CONFIG.apiUrl}borraQuizz`;
        let body = { quizz: quizz.id };
        console.log(body)
        let options = new RequestOptions({ headers: this.headers });
        return this.http.post(url, body, options)
            .toPromise()
            .then(resp => {
                this.bar.done();
                if (resp.json().status == "200") {
                    this.notifyService.notify("Has borrado tu quizz correctamente, una gran perdida...", "success");
                    this.deleteImages(quizz);
                    location.reload();
                } else if (resp.json().status == "Usuario sin permiso") {
                    this.notifyService.notify("No tienes permiso", "error");
                } else if (resp.json().status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                } else {
                    this.authService.logout();
                    return null;
                }

                return resp.json();
            })
    }

    deleteImages(quizz:Quizz){
        let files:string[] = [];
        files.push(quizz.image);
        for(let i=0;i<quizz.soluciones.length;i++){
            files.push(quizz.soluciones[i].image);
        }
        for(let j=0;j<files.length;j++){
            this.afStorage.ref(files[j]).delete();
        }
    }

    listaModeracion(): Promise<Array<Quizz>> {
        let id = this.authService.getAuthUserId();
        let url = `${CONFIG.apiUrl}quizz/moderacion`;
        let body = { id:id };
        let options = new RequestOptions({ headers: this.headers });
        return this.http.post(url, body, options)
            .toPromise()
            .then(resp => {
                if (resp.json().status == '200') {
                    return resp.json().cont;
                } else {
                    return null;
                }
            })
            .catch(function (e) {
                console.log("Error ", e)
            })
    }

    moderaQuizz(id:number,accion:boolean){
        let url = `${CONFIG.apiUrl}modera`;
        let body = { quizz: id,usuario:this.authService.getAuthUserId(),decision:accion };
        console.log(body)
        let options = new RequestOptions({ headers: this.headers });
        return this.http.post(url, body, options)
            .toPromise()
            .then(resp => {
                this.bar.done();
                if (resp.json().status == "200") {
                    this.notifyService.notify("Acción registrada", "success");
                    return true;
                } else if (resp.json().status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                } else {
                    this.authService.logout();
                    return null;
                }
                return resp.json();
            })
    }


}