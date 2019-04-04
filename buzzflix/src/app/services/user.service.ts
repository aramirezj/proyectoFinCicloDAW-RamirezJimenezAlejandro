import {Observable} from 'rxjs'; 
import { Injectable,EventEmitter } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CONFIG } from './../config/config';
import { Usuario } from '../modelo/usuario';
import { NgProgressService } from 'ng2-progressbar';
import { Quizz } from '../modelo/Quizz';
@Injectable()
export class UserService{
    public userProfileUpdated: EventEmitter<Usuario>
    private headers:Headers
    constructor(
        private authService:AuthService,
        private http: Http,
        private bar:NgProgressService
    ){
        this.userProfileUpdated = new EventEmitter();
    }

    uploadAvatar(avatar:File){
        let fd = new FormData();
            fd.append('file', avatar, avatar.name);
        this.http.post(`${CONFIG.apiUrl}file`,fd)
        .toPromise()
        .then((response)=>{
        })
    }

    getUserWall(id:number):Promise<Array<Quizz>>|any{
        return this.http.get(`${CONFIG.apiUrl}usuario/${id}/wall`)
        .toPromise()
        .then((response)=> response.json());
    }
    getUserFollowers(id:number):Promise<number>{
        return this.http.get(`${CONFIG.apiUrl}usuario/${id}/followers`)
        .toPromise()
        .then((response)=> response.json().cont);
    }

    getUserById(id:number):Promise<Usuario>{
        if(id== this.authService.getAuthUserId()){
            return Promise.resolve(this.authService.getAuthUser());
            
        }
        return this.http.get(`${CONFIG.apiUrl}usuario/${id}`)
        .toPromise()
        .then((response)=> response.json());
        
    }
    getUsuarios(nombre:string):Promise<Array<Usuario>>{
        if(nombre==""){
            nombre="EVERYTHINGPLEASE";
            console.log(nombre);
        }
        return this.http.get(`${CONFIG.apiUrl}usuarios/${nombre}`)
        .toPromise()
        .then((response)=> response.json());
        
    }

    updateProfile(old:Usuario,file:File):Promise<Usuario>{
        let id = +this.authService.getAuthUserId();
        let url = `${CONFIG.apiUrl}usuario/actualizar/${id}`;
        let avatar = null;
        if(file!=null){
            avatar=file.name
        }
        let body = {name:old.name,email:old.email,avatar:avatar};
        let options = new RequestOptions({headers:this.headers});
        return this.http.put(url,body,options)
        .toPromise()
        .then((response)=>{
            if(response.json().status="OK"){
                if(file!=null){
                    this.uploadAvatar(file);
                }
                let aux = this.authService.getAuthUser();
                aux.name=old.name;
                aux.email=old.email;
                aux.avatar=avatar;
                console.log("aux actualizado")

                localStorage.setItem("usuario",JSON.stringify(aux));
                this.userProfileUpdated.emit(aux);
                return aux;
            }else{
                this.userProfileUpdated.emit(null);
                return null;
            }
        })
    }
}