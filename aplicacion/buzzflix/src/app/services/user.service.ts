import { Observable, Subject } from 'rxjs';
import { Injectable, EventEmitter} from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from './../config/config';
import { Usuario } from '../modelo/Usuario';
import { NgProgressService } from 'ng2-progressbar';
import { Quizz } from '../modelo/Quizz';
import { NotifyService } from './notify.service';
import { Image } from '../modelo/Image';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { Logro } from '../modelo/Logro';
import { BehaviorSubject } from 'rxjs';
import { FuncionesService } from './funciones.service';

@Injectable()
export class UserService {
    public idPaquete = new BehaviorSubject(0);
    currentMessage = this.idPaquete.asObservable();
    public userProfileUpdated: EventEmitter<Usuario>
    private headers: HttpHeaders
    model: Image;
    imagesRef: AngularFirestoreCollection<Image>;
    image: Observable<Image[]>;
    successMsg = 'Data successfully saved.';
    constructor(
        private authService: AuthService,
        private http: HttpClient,
        private bar: NgProgressService,
        private notifyService: NotifyService,
        private funcionesService: FuncionesService,
        private firestore: AngularFirestore,
        private afStorage: AngularFireStorage
    ) {
        this.userProfileUpdated = new EventEmitter();
        this.headers = new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` });
        this.imagesRef = this.firestore.collection<Image>('imagenes');
        this.model = {
            name: ''
        }
    }
    changeMessage(id: number):void {
        this.idPaquete.next(id)
      }

    getToken(): string {
        return localStorage.getItem('token');
    }
    isAdmin():any{
        let url = `${CONFIG.apiUrl}usuario/admin`;

        /*this.funcionesService.peticionGet(url).subscribe((response:any) => {
            console.log(response)
        if (response.status == "200") {
            return response.respuesta;
        } else if (response.status == "Token invalido") {
            this.authService.logout();
            return response.respuesta;
        } else if(response.status == "Error sql"){
            this.notifyService.notify("Error en el servidor", "error");
            return response.respuesta;
        }
    })*/
        
        return this.http.get(url, { observe: 'body', headers: this.headers })
        .map((response: any) => {
                if (response.status == "200") {
                    return response.respuesta;
                } else if (response.status == "Token invalido") {
                    this.authService.logout();
                    return response.respuesta;
                } else if(response.status == "Error sql"){
                    this.notifyService.notify("Error en el servidor", "error");
                    return response.respuesta;
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }
    


    getUserWall(id: number): Observable<Array<Quizz>> | any {
        return this.http.get(`${CONFIG.apiUrl}usuario/${id}/wall`,  { observe: 'body', headers: this.headers })
        .map((response: any) => {
               return response
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }
    getLogros(id:number): Observable<Array<Logro>>{
        return this.http.get(`${CONFIG.apiUrl}usuario/${id}/logros`, { observe: 'body', headers: this.headers })
        .map((response: any) => {
               return response.logros
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }
    getUserStats(id: number): Observable<number> {

        let url = `${CONFIG.apiUrl}usuario/stats`;
        let body = { origen: this.authService.getAuthUserId(), destino: id };
        return this.http.post(url, body, { observe: 'body', headers: this.headers })
        .map((response: any) => {
                this.bar.done();
                if (response.status == "200") {
                    return response.cont;
                } else if (response.status == "Usuario sin permiso") {
                    this.notifyService.notify("No tienes permiso", "error");
                } else if (response.status == "Error sql") {
                    this.notifyService.notify("Error en el servidor", "error");
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }

    getUserById(id: number): Observable<Usuario> {  //PROTEGIDO
        return this.http.get(`${CONFIG.apiUrl}usuario/${id}`, { observe: 'body', headers: this.headers })
        .map((response: any) => {
                if (response.status == "200") {
                    return response.usuario
                } else if (response.status == "Token invalido") {
                    this.authService.logout();
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });

    }
    getUsuarios(nombre: string): Observable<Array<Usuario>> {  //PROTEGIDO
        if (nombre == "") {
            nombre = "EVERYTHINGPLEASE";
        }

        return this.http.get(`${CONFIG.apiUrl}usuarios/${nombre}`, { observe: 'body', headers: this.headers })
        .map((response: any) => {
                if (response.status == "200") {
                    return response.usuarios;
                } else if (response.status == "Error sql") {
                    this.notifyService.notify("Hubo un error con el servidor.", "error");
                    return null;
                } else {
                    this.authService.logout();
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });

    }

    updateProfile(datos: any): Observable<Usuario> { //PROTECTED
        const OLDUSUARIO = this.authService.getAuthUser();
        let id = +this.authService.getAuthUserId();
        let url = `${CONFIG.apiUrl}usuario/actualizar/${id}`;

        let file = datos["file"];
        let avatar = undefined;
        if (file != undefined) {
            avatar = file.name;
        } else {
            avatar = OLDUSUARIO.avatar
        }
        if (datos["nombre"] == undefined) {
            datos["nombre"] = OLDUSUARIO.name;
        }
        let body = {
            name: datos["nombre"],
            oldpass: datos["oldpass"],
            newpass: datos["newpass"],
            avatar: avatar
        };

        return this.http.put(url, body,  { observe: 'body', headers: this.headers })
        .map((response: any) => {
                if (response.status == "200") {
                    let aux = this.authService.getAuthUser();
                    aux.name = datos["nombre"];
                    aux.avatar = avatar;
                    localStorage.setItem("usuario", JSON.stringify(aux));
                    if (file != undefined) {
                        let ref = this.afStorage.ref(avatar);
                        const uploadTask = ref.put(file);
                        uploadTask.snapshotChanges().pipe(
                            finalize(() => {
                                if (datos["oldfile"] != undefined && datos["oldfile"]!="") {
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

                } else if (response.status == "Token invalido") {
                    this.authService.logout();
                } else if (response.status == "Wrong password") {
                    this.notifyService.notify("La contraseña antigua es erronea.", "error");
                    return this.authService.getAuthUser();
                } else if (response.status == "Error SQL") {
                    this.notifyService.notify("El servidor no se encuentra disponible.", "error");
                    return this.authService.getAuthUser();
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }
    borraImagen(avatar: string):void {
        this.afStorage.ref(avatar).delete();
    }

}