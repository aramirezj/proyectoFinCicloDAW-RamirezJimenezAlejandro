import {Observable} from 'rxjs'; 
import {Injectable, ɵConsole } from '@angular/core';
import {CONFIG } from '../config/config';
import {Http} from '@angular/http';
import {Router} from '@angular/router'
import {Usuario} from '../modelo/Usuario';
import { NotifyService } from './notify.service';
import { NgProgressService } from 'ng2-progressbar';
/*import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';*/


@Injectable()
export class AuthService{

    constructor(
        private http: Http,
        private router: Router,
        private notifyService: NotifyService,
        private bar:NgProgressService
    ){

    }

    getAuthUser(): Usuario{
        return JSON.parse(localStorage.getItem('usuario'))
    }

    getAuthUserId():number{
        return JSON.parse(localStorage.getItem('usuario')).id
    }

    register(name:string,email:string,password:string):Promise<Usuario>{
        this.bar.start();
        console.log("Llego a la peticion"+name+"-"+email+"-"+password);
        return this.http.post(`${CONFIG.apiUrl}register`,{name:name,email:email,password:password})
        .toPromise()
        .then((response)=>{
            let aux:Usuario = new Usuario(response.json().id,name,email,null);
            localStorage.setItem("token",response.json().token);
            this.bar.done();
            return aux;
        })
    }

    login(email:string,password:string):Promise<Usuario>{
        this.bar.start();
        return this.http.post(`${CONFIG.apiUrl}authenticate`,{email:email,password:password})
        .toPromise()
        .then((response)=>{
            console.log(response)
            if(response.status==200){
                let aux:Usuario = response.json().usuario;
                localStorage.setItem("token",response.json().token);
                this.bar.done();
                return aux; 
            }else{
                this.bar.done();
                return null;
            }
            
        })
    }

    logUserIn(aux:Usuario):void{
        if(aux==null){
            this.notifyService.notify("Datos incorrectos","error");
        }else{
            localStorage.setItem("usuario",JSON.stringify(aux));
            this.notifyService.notify("Has iniciado sesión correctamente","success");
            this.router.navigate(['/dashboard']);
        }
        
    }

    isLoggedIn(): boolean{
        let usuario = localStorage.getItem("usuario");
        if(usuario){
            return true
        }else{
            return false;
        }
    }

    logout(){
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        this.notifyService.notify("Has cerrado la sesión correctamente","success");
        this.router.navigate(['/auth/login']);
    }

    
}