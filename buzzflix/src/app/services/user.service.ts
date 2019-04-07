import { Observable } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CONFIG } from './../config/config';
import { Usuario } from '../modelo/Usuario';
import { NgProgressService } from 'ng2-progressbar';
import { Quizz } from '../modelo/Quizz';
import { NotifyService } from './notify.service';
@Injectable()
export class UserService {
    public userProfileUpdated: EventEmitter<Usuario>
    private headers: Headers
    constructor(
        private authService: AuthService,
        private http: Http,
        private bar: NgProgressService,
        private notifyService: NotifyService
    ) {
        this.userProfileUpdated = new EventEmitter();
        this.headers = new Headers({ 'Authorization': `Bearer ${this.getToken()}` });
    }


    getToken(): string {
        return localStorage.getItem('token');
    }

    uploadAvatar(avatar: File) {
        let fd = new FormData();
        fd.append('file', avatar, avatar.name);
        this.http.post(`${CONFIG.apiUrl}file`, fd)
            .toPromise()
            .then((response) => {
            })
    }

    getUserWall(id: number): Promise<Array<Quizz>> | any {
        return this.http.get(`${CONFIG.apiUrl}usuario/${id}/wall`)
            .toPromise()
            .then((response) => response.json());
    }
    getUserFollowers(id: number): Promise<number> {
        return this.http.get(`${CONFIG.apiUrl}usuario/${id}/followers`)
            .toPromise()
            .then((response) => response.json().cont);
    }

    getUserById(id: number): Promise<Usuario> {  //PROTEGIDO
        if (id == this.authService.getAuthUserId()) {
            return Promise.resolve(this.authService.getAuthUser());
        }
        let options = new RequestOptions({ headers: this.headers });
        return this.http.get(`${CONFIG.apiUrl}usuario/${id}`, options)
            .toPromise()
            .then((response) => {
                if (response.json().status == "200") {
                    return response.json().usuario
                } else if (response.json().status == "Token invalido") {
                    this.notifyService.notify("Hubo un error con la autenticación, cierra y abre sesión y recarga la página.", "error");
                    return null;
                }

            });

    }
    getUsuarios(nombre: string): Promise<Array<Usuario>> {  //PROTEGIDO
        if (nombre == "") {
            nombre = "EVERYTHINGPLEASE";
        }
        let options = new RequestOptions({ headers: this.headers });
        return this.http.get(`${CONFIG.apiUrl}usuarios/${nombre}`,options)
            .toPromise()
            .then((response) => {
                if(response.json().status=="200"){
                    this.notifyService.notify("Busqueda realizada","success");
                    return response.json().usuarios;
                }else if(response.json().status=="Error sql"){
                    this.notifyService.notify("Hubo un error con el servidor.", "error");
                    return null;
                }else{
                    this.notifyService.notify("Hubo un error de autenticación, cierra y abre sesión de nuevo y recarga la página.", "error");
                    return null;
                }
                
            });

    }

    updateProfile(old: Usuario, file: File): Promise<Usuario> { //PROTECTED
        let id = +this.authService.getAuthUserId();
        let url = `${CONFIG.apiUrl}usuario/actualizar/${id}`;
        let avatar = null;
        if (file != null) {
            avatar = file.name
        }
        let body = { name: old.name, email: old.email, avatar: avatar };
        let options = new RequestOptions({ headers: this.headers });


        return this.http.put(url, body, options)
            .toPromise()
            .then((response) => {
                console.log(response.json().status)
                if (response.json().status == "200") {
                    console.log("Peticion realizada correctamente");
                    if (file != null) {
                        this.uploadAvatar(file);
                    }
                    let aux = this.authService.getAuthUser();
                    aux.name = old.name;
                    aux.email = old.email;
                    aux.avatar = avatar;
                    localStorage.setItem("usuario", JSON.stringify(aux));
                    this.userProfileUpdated.emit(aux);
                    this.notifyService.notify("¡Usuario actualizado con exito!", "success");
                    return aux;
                } else {
                    console.log("??")
                    let aux = this.authService.getAuthUser();
                    this.notifyService.notify("Hubo un error, los cambios no se han guardado.", "error");
                    return aux;
                }
            })
    }

    /*private handleError(error: any): Promise<any> {
        console.error('Ha ocurrido un error, ', error);
        return Promise.reject(error.message || error);
    }*/
}