import {Observable} from 'rxjs'; 
import { Injectable, ɵConsole } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CONFIG } from './../config/config';
import { NgProgressService } from 'ng2-progressbar';
import { Quizz } from '../modelo/Quizz';
import { DatePipe } from '@angular/common';
import { UserService } from './user.service';
import { NotifyService } from './notify.service';
 @Injectable()
export class QuizzService{
    private headers:Headers
    constructor(
        private authService:AuthService,
        private userService:UserService,
        private http: Http,
        private bar:NgProgressService,
        private notifyService:NotifyService
    ){
        this.headers = new Headers({ 'Authorization': `Bearer ${this.getToken()}` });
    }


    

    getToken(): string {
        return localStorage.getItem('token');
    }

    votaQuizz(quizz:number,n:number){
        this.bar.start();
        let id = this.authService.getAuthUserId();
        let fecha = new Date();
        let url=`${CONFIG.apiUrl}vota`;
        let body = {origen:id,quizz: quizz,cantidad:n};
        let options = new RequestOptions({headers:this.headers});
        return this.http.post(url,body,options)
        .toPromise()
        .then(resp=>{
            this.bar.done();
            if(resp.json().status=="200"){
                this.notifyService.notify("Has votado correctamente, ¡Gracias!","success");
            }else if(resp.json().status=="Usuario sin permiso"){
                this.notifyService.notify("No tienes permiso","error");
            }else if(resp.json().status=="Error sql"){
                this.notifyService.notify("Error en el servidor","error");
            }else{
                this.notifyService.notify("Error de autenticación, cierra sesión, vuelve a iniciar y recarga la página","error");
            }
            
            return resp.json();
        })
    }

    sendFile(files:Array<File>){ //NO SE COMO PROTEGERLO BIEN
        let options = new RequestOptions({ headers: this.headers });
        let fd = new FormData();
        for(let i=0;i<files.length;i++){
            fd.append('file'+i, files[i], files[i].name);
        }
        this.http.post(`${CONFIG.apiUrl}file`,fd,options)
        .toPromise()
        .then((response)=>{
        })
    }

    getCantidad(id:number):Promise<number>{
        return this.http.get(`${CONFIG.apiUrl}quizz/${id}/cantidad`)
        .toPromise()
        .then(resp=>{
            return resp.json().resultado;
        })
        .catch(function(e){
            console.log("Error ",e)
        })
    }

    getMedia(id:number):Promise<number>{
        return this.http.get(`${CONFIG.apiUrl}quizz/${id}/media`)
        .toPromise()
        .then(resp=>{
            return resp.json().resultado;
        })
        .catch(function(e){
            console.log("Error ",e)
        })
    }

    createQuizz(quizz:Quizz):Promise<any>{
        this.bar.start();
        let id = this.authService.getAuthUserId();
        let fecha = new Date();
        let url=`${CONFIG.apiUrl}creaQuizz`;
        quizz.fechacreacion=fecha;
        quizz.creador = id;
        let prep = JSON.stringify(quizz);
        let body = {creador: this.authService.getAuthUserId(), titulo: quizz.titulo,contenido:prep,fecha:fecha};
        console.log(body);
        let options = new RequestOptions({headers:this.headers});
        return this.http.post(url,body,options)
        .toPromise()
        .then(resp=>{
            this.bar.done();
            return resp.json();
        })
    }
    obtenerQuizzSeguidos():Promise<Array<Quizz>>{
        this.headers = new Headers({ 'Authorization': `Bearer ${this.getToken()}` });
        console.log(this.headers);
        let id = this.authService.getAuthUserId();
        return this.http.get(`${CONFIG.apiUrl}quizz/${id}/seguidos`)
        .toPromise()
        .then(resp=>{
            if(resp.json().status == 'OK'){
                return resp.json().cont;
            }else{
                return null;
            }
        })
        .catch(function(e){
            console.log("Error ",e)
        })
       
    }
    obtenerAllQuizz():Promise<Array<Quizz>>{
        let id = this.authService.getAuthUserId();
        return this.http.get(`${CONFIG.apiUrl}quizz/todos`)
        .toPromise()
        .then(resp=>{
            if(resp.json().status == 'OK'){
                return resp.json().cont;
            }else{
                return null;
            }
        })
        .catch(function(e){
            console.log("Error ",e)
        })
       
    }

    getQuizz(id:number):Promise<Quizz>{
        return this.http.get(`${CONFIG.apiUrl}quizz/${id}`)
        .toPromise()
        .then(resp=>{
            if(resp.json().status == 'OK'){
                let aux = resp.json();
                return JSON.parse(aux.cont[0].contenido);
            }else{
                return null;
            }
        })
        .catch(function(e){
            console.log("Error ",e)
        })
    }
}