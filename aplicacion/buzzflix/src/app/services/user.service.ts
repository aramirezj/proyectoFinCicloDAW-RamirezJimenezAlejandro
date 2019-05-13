import { Observable } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CONFIG } from './../config/config';
import { Usuario } from '../modelo/Usuario';
import { NgProgressService } from 'ng2-progressbar';
import { Quizz } from '../modelo/Quizz';
import { NotifyService } from './notify.service';
import { Image } from '../modelo/Image';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';

@Injectable()
export class UserService {
    public userProfileUpdated: EventEmitter<Usuario>
    private headers: Headers
    model: Image;
    imagesRef: AngularFirestoreCollection<Image>;
    image: Observable<Image[]>;
    successMsg = 'Data successfully saved.';
    constructor(
        private authService: AuthService,
        private http: Http,
        private bar: NgProgressService,
        private notifyService: NotifyService,
        private firestore: AngularFirestore,
        private afStorage: AngularFireStorage
    ) {
        this.userProfileUpdated = new EventEmitter();
        this.headers = new Headers({ 'Authorization': `Bearer ${this.getToken()}` });
        this.imagesRef = this.firestore.collection<Image>('imagenes');
        this.model = {
            name: ''
        }
    }


    getToken(): string {
        return localStorage.getItem('token');
    }


    getUserWall(id: number): Promise<Array<Quizz>> | any {
        return this.http.get(`${CONFIG.apiUrl}usuario/${id}/wall`)
            .toPromise()
            .then((response) => response.json());
    }
    getUserFollowers(id: number): Promise<number> {

        let url = `${CONFIG.apiUrl}usuario/followers`;
        let body = { origen: this.authService.getAuthUserId(),destino:id };
        let options = new RequestOptions({ headers: this.headers });
        return this.http.post(url, body, options)
            .toPromise()
            .then(resp => {
                this.bar.done();
                if (resp.json().status == "200") {
                    return resp.json().cont;
                } else if (resp.json().status == "Usuario sin permiso") {
                    this.notifyService.notify("No tienes permiso", "error");
                } else if (resp.json().status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                }
            })
    }

    getUserById(id: number): Promise<Usuario> {  //PROTEGIDO
        if (id == this.authService.getAuthUserId()) {
            return Promise.resolve(this.authService.getAuthUser());
        }
        this.headers = new Headers({ 'Authorization': `Bearer ${this.getToken()}` });
        let options = new RequestOptions({ headers: this.headers });

        return this.http.get(`${CONFIG.apiUrl}usuario/${id}`, options)
            .toPromise()
            .then((response) => {
                if (response.json().status == "200") {
                    return response.json().usuario
                } else if (response.json().status == "Token invalido") {
                    this.authService.logout();
                }

            });

    }
    getUsuarios(nombre: string): Promise<Array<Usuario>> {  //PROTEGIDO
        if (nombre == "") {
            nombre = "EVERYTHINGPLEASE";
        }
        this.headers = new Headers({ 'Authorization': `Bearer ${this.getToken()}` });
        let options = new RequestOptions({ headers: this.headers });
        return this.http.get(`${CONFIG.apiUrl}usuarios/${nombre}`, options)
            .toPromise()
            .then((response) => {
                if (response.json().status == "200") {
                    //this.notifyService.notify("Busqueda realizada","success");
                    return response.json().usuarios;
                } else if (response.json().status == "Error sql") {
                    this.notifyService.notify("Hubo un error con el servidor.", "error");
                    return null;
                } else {
                    this.authService.logout();
                }

            });

    }

    updateProfile(old: Usuario, file: File): Promise<Usuario> { //PROTECTED
        console.log(old);
        console.log(file);
        let id = +this.authService.getAuthUserId();
        let url = `${CONFIG.apiUrl}usuario/actualizar/${id}`;
        let avatar = old.avatar;
        if (file != null || file != undefined) {
            avatar = file.name
        }

        let body = { name: old.name, email: old.email, avatar: avatar };
        let options = new RequestOptions({ headers: this.headers });

        return this.http.put(url, body, options)
            .toPromise()
            .then((response) => {
                if (response.json().status == "200") {
                    let aux = this.authService.getAuthUser();
                    aux.name = old.name;
                    aux.email = old.email;
                    aux.avatar = avatar;

                    localStorage.setItem("usuario", JSON.stringify(aux));
                    if (file != null || file != undefined) {
                        console.log("preparo subida")
                        let ref = this.afStorage.ref(file.name);
                        const uploadTask = ref.put(file);
                        uploadTask.snapshotChanges().pipe(
                            finalize(() => {
                                if (old.avatar != null && old.avatar != undefined && old.avatar != "null" && old.avatar != "") {
                                    if (old.avatar != avatar) {
                                        console.log("preparo borrado")
                                        this.borraImagen(old.avatar);
                                    }
                                }
                                console.log("Peticion de subida realizada correctamente");
                                this.userProfileUpdated.emit(aux);
                                this.notifyService.notify("¡Usuario actualizado con exito!", "success");
                                return aux;
                            })
                        ).subscribe()
                    } else {
                        this.notifyService.notify("¡Usuario actualizado con exito!", "success");
                        this.userProfileUpdated.emit(aux);
                        return aux;
                    }
                } else {
                    let aux = this.authService.getAuthUser();
                    this.notifyService.notify("Hubo un error, los cambios no se han guardado.", "error");
                    return aux;
                }
            })
    }
    borraImagen(avatar: string) {
        this.afStorage.ref(avatar).delete();
    }

}