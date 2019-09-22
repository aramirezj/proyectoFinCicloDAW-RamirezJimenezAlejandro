import { Observable } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from './auth.service';
import { CONFIG } from './../config/config';
import { Usuario } from '../modelo/Usuario';
import { NgProgress } from 'ngx-progressbar';
import { Quizz } from '../modelo/Quizz';
import { NotifyService } from './notify.service';
import { Image } from '../modelo/Image';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { Logro } from '../modelo/Logro';
import { BehaviorSubject } from 'rxjs';
import { RestService } from './rest.service';

@Injectable()
export class UserService {
    public idPaquete = new BehaviorSubject(0);
    currentMessage = this.idPaquete.asObservable();
    public userProfileUpdated: EventEmitter<Usuario>
    model: Image;
    imagesRef: AngularFirestoreCollection<Image>;
    image: Observable<Image[]>;
    successMsg = 'Data successfully saved.';
    constructor(
        private authService: AuthService,
        private bar: NgProgress,
        private notifyService: NotifyService,
        private restService: RestService,
        private firestore: AngularFirestore,
        private afStorage: AngularFireStorage
    ) {
        this.userProfileUpdated = new EventEmitter();
        this.imagesRef = this.firestore.collection<Image>('imagenes');
        this.model = {
            name: ''
        }
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

    getUserWall(id: number): Observable<Array<Quizz>> {
        let url = `${CONFIG.apiUrl}usuario/${id}/wall`;
        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });
    }
    getLogros(id: number): Observable<Array<Logro>> {
        let url = `${CONFIG.apiUrl}usuario/${id}/logros`;
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

    getUserById(id: number): Observable<Usuario> {  //PROTEGIDO
        let url = `${CONFIG.apiUrl}usuario/${id}`;

        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });

    }
    getUsuarios(nombre: String): Observable<Array<Usuario>> {  //PROTEGIDO
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

        let url = `${CONFIG.apiUrl}usuario/actualizar/${id}`;
        let body = {
            name: datos["nombre"],
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
                aux.avatar = avatar;
                localStorage.setItem("usuario", JSON.stringify(aux));

                if (file != undefined) {
                    let ref = this.afStorage.ref(avatar);
                    const uploadTask = ref.put(file);
                    uploadTask.snapshotChanges().pipe(
                        finalize(() => {
                            if (datos["oldfile"] != undefined && datos["oldfile"] != "") {
                                this.borraImagen(datos["oldfile"]);
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
                observer.next(response.respuesta)
                observer.complete();
            })
        });
    }
    borraImagen(avatar: string): void {
        this.afStorage.ref(avatar).delete();
    }

}