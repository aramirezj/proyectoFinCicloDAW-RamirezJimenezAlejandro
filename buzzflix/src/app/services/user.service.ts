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


    test(avatar: File) {
        this.model = {
            name: avatar.name
        }
        const randomId = Math.random().toString(36).substring(2);
        let ref = this.afStorage.ref(randomId);
        //let image: Image = new Image(avatar.name, avatar);
        this.imagesRef.add(this.model).then(_ => alert(this.successMsg));
        ref.put(avatar);
    }

    getToken(): string {
        return localStorage.getItem('token');
    }

    uploadAvatar(avatar: File, randomId: string) {
        let fd = new FormData();
        fd.append('file', avatar, randomId);
        let ref = this.afStorage.ref(randomId);
        this.http.post(`${CONFIG.apiUrl}file`, fd)
            .toPromise()
            .then((response) => {
            })
        //console.log(this.firestore.collection('imagenes').add(image));
        ref.put(avatar);
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
        this.headers = new Headers({ 'Authorization': `Bearer ${this.getToken()}` });
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
            let randomId = Math.random().toString(36).substring(2);
            let ext = avatar.split(".")[1];
            randomId = randomId + "." + ext;
            avatar = randomId;
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
                        let ref = this.afStorage.ref(avatar);
                        const uploadTask = ref.put(file);
                        uploadTask.snapshotChanges().pipe(
                            finalize(() => {
                                console.log("Peticion realizada correctamente");
                                this.userProfileUpdated.emit(aux);
                                this.notifyService.notify("¡Usuario actualizado con exito!", "success");
                                return aux;
                            })
                        ).subscribe()
                    }else{
                        this.notifyService.notify("¡Usuario actualizado con exito!", "success");
                        aux.avatar = null;
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

    /*private handleError(error: any): Promise<any> {
        console.error('Ha ocurrido un error, ', error);
        return Promise.reject(error.message || error);
    }*/
}