import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CONFIG } from './../config/config';
import { Quizz } from '../modelo/Quizz';
import { NotifyService } from './notify.service';
import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { RestService } from './rest.service';
@Injectable()
export class QuizzService {
    constructor(
        private authService: AuthService,
        private restService: RestService,
        private notifyService: NotifyService,
        private afStorage: AngularFireStorage
    ) {
    }

    uploadImage(files): void {
        for (let i = 0; i < files.length; i++) {
            let ref = this.afStorage.ref(files[i].name);
            ref.put(files[i]);
        }
    }
    deleteImages(quizz: Quizz): void {
        let files: string[] = [];
        files.push(quizz.image);
        for (let i = 0; i < quizz.soluciones.length; i++) {
            files.push(quizz.soluciones[i].image);
        }
        for (let j = 0; j < files.length; j++) {
            this.afStorage.ref(files[j]).delete();
        }
    }

    reportarQuiz(id: number): Observable<void> {
        let url = `${CONFIG.apiUrl}reportar`;
        let body = { origen: this.authService.getAuthUserId(), destino: id, motivo: "quiz" };

        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });

    }

    votaQuizz(quizz: number | string, n: number): Observable<boolean> {
        let id = this.authService.getAuthUserId();
        let url = `${CONFIG.apiUrl}vota`;
        let body = { origen: id, quizz: quizz, cantidad: n };
        if (id == 0) {
            this.notifyService.notify("Lo sentimos, debes iniciar sesión para poder votar", "error");
            return Observable.create(observer => {
                observer.next(false)
                observer.complete();
            });
        } else {
            return Observable.create(observer => {
                this.restService.peticionHttp(url, body).subscribe(response => {
                    this.notifyService.notify("Has votado correctamente, ¡Gracias!", "success");
                    observer.next(true)
                    observer.complete();
                })
            });
        }

    }

    createQuizz(quizz: Quizz, files: File[], privado: string): Observable<any> {
        let id = this.authService.getAuthUserId();
        let fecha = new Date();
        quizz.fechacreacion = fecha;
        quizz.creador = id;
        let prep = JSON.stringify(quizz);

        let url = `${CONFIG.apiUrl}creaQuizz`;
        let body = { creador: this.authService.getAuthUserId(), titulo: quizz.titulo, contenido: prep, fecha: fecha, privado: privado };

        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                this.uploadImage(files);
                observer.next(response.respuesta)
                observer.complete();
            })
        });
    }

    ObtenerQuizzes(opcion: String, cadena: string): Observable<Array<Quizz>> {
        let url = opcion == "todos" ? `${CONFIG.apiUrl}quizz/todos/${cadena}` :
            `${CONFIG.apiUrl}quizz/${this.authService.getAuthUserId()}/seguidos/${cadena}`
        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response)
                observer.complete();
            })
        });
    }

    obtenerQuizzSeguidos(inicio: number, fin: number): Observable<Array<Quizz>> {
        let id = this.authService.getAuthUserId();
        let cadena = inicio + "-" + fin;
        let url = `${CONFIG.apiUrl}quizz/${id}/seguidos/${cadena}`;

        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response)
                observer.complete();
            })
        });
    }

    obtenerAllQuizz(inicio: number, fin: number): Observable<Array<Quizz>> {
        let cadena = inicio + "-" + fin;
        let url = `${CONFIG.apiUrl}quizz/todos/${cadena}`;

        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response)
                observer.complete();
            })
        });
    }

    getQuizz(id: string): Observable<Quizz> {
        let url = `${CONFIG.apiUrl}quizz/${id}`;

        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                let rawquiz = response.respuesta;
                let quiz = JSON.parse(rawquiz.contenido);
                quiz.id = rawquiz.id;
                observer.next(quiz)
                observer.complete();
            })
        });
    }

    getQuizzes(nombre: String): Observable<Array<Quizz>> {
        let url = `${CONFIG.apiUrl}quizzes/${nombre}`;

        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });
    }



    borraQuizz(quizz: Quizz) {
        let url = `${CONFIG.apiUrl}borraQuizz`;
        let body = { id: quizz.id };

        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                this.notifyService.notify("Has borrado tu quizz correctamente, una gran perdida...", "success");
                this.deleteImages(quizz);
                location.reload();
                observer.next()
                observer.complete();
            })
        });
    }



    listaModeracion(): Observable<Array<Quizz>> {

        let url = `${CONFIG.apiUrl}quizz/moderacion`;
        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });
    }

    moderaQuizz(id: number, accion: boolean): Observable<boolean> { //PROTEGIDO
        let url = `${CONFIG.apiUrl}modera`;
        let body = { quizz: id, usuario: this.authService.getAuthUserId(), decision: accion };
        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                this.notifyService.notify("Acción registrada", "success");
                observer.next()
                observer.complete();
            })
        });

    }
    cambiaTipo(quiz: Quizz, privado: boolean): Observable<void> {
        let text = privado ? Math.random().toString(36).substring(2) : null;
        let url = `${CONFIG.apiUrl}cambiaTipo`;
        let body = { quizz: quiz.id, privado: text };

        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                location.reload();
                observer.next()
                observer.complete();
            })
        });
    }


}