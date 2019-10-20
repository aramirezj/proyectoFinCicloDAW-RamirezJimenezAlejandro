import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CONFIG } from './../config/config';
import { Quiz } from '../modelo/Quiz';
import { NotifyService } from './notify.service';
import { RestService } from './rest.service';
import { finalize } from 'rxjs/operators';
import { NgProgress } from 'ngx-progressbar';
import { FileService } from './file.service';
@Injectable()
export class QuizService {
    constructor(
        private authService: AuthService,
        private restService: RestService,
        private notifyService: NotifyService,
        private fileService: FileService,
        private bar: NgProgress
    ) {
    }


    buildUrl(titulo: string, id: string | number): string {
        titulo = titulo.trim();
        titulo = titulo.replace(/ /g, "-");
        titulo = titulo.replace("¿", "");
        titulo = titulo.replace("?", "");
        titulo = titulo.replace("¡", "");
        titulo = titulo.replace("!", "");
        titulo = titulo.replace("á", "a");
        titulo = titulo.replace("é", "e");
        titulo = titulo.replace("í", "i");
        titulo = titulo.replace("ó", "o");
        titulo = titulo.replace("ú", "u");
        titulo += "?n=" + id;
        return titulo;
    }

    resolveUrl(cadena: string): string {
        let id = cadena.split("?n=")[1] != null ? cadena.split("?n=")[1] : cadena.split("%3D")[1];
        return id;
    }

    convierteModelo(rawQuiz: any) {
        let quiz: Quiz = JSON.parse(rawQuiz.contenido)
        return quiz;
    }

    uploadImage(files): Observable<string> {

        return Observable.create(observer => {
            for (let i = 0; i < files.length; i++) {
                let ref = this.fileService.obtenerReferencia(files[i].name);
                let task = ref.put(files[i]);
                task.snapshotChanges().pipe(
                    finalize(() => {
                        ref.getDownloadURL().subscribe(url => {
                            observer.next(url)
                            observer.complete();
                        });
                    })
                ).subscribe();


            }
        })

    }
    deleteImages(quiz: any): void {
        quiz = quiz.soluciones == null ? this.convierteModelo(quiz) : quiz; //Compruebo si viene con modelo ya
        let files: string[] = [];
        files.push(quiz.image);
        for (let i = 0; i < quiz.soluciones.length; i++) {
            files.push(quiz.soluciones[i].image);
        }
        for (let j = 0; j < files.length; j++) {
            this.fileService.deleteImg(files[j]);
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

    createQuiz(quiz: Quiz, files: File[], privado: string): Observable<any> {
        this.bar.start();
        let id = this.authService.getAuthUserId();
        let fecha = new Date();
        quiz.fechacreacion = fecha;
        quiz.creador = id;
        let prep = JSON.stringify(quiz);
        let url = `${CONFIG.apiUrl}creaQuiz`;

        return Observable.create(observer2 => {
            this.uploadImage(files).subscribe(resp => {
                let body = { creador: this.authService.getAuthUserId(), titulo: quiz.titulo, contenido: prep, fecha: fecha, privado: privado, banner: resp, tipo: quiz.tipo };
                this.restService.peticionHttp(url, body).subscribe(response => {
                    this.bar.done();
                    observer2.next(response.respuesta)
                    observer2.complete();
                })

            });
        })
    }

    ObtenerQuizzes(opcion: string, cadena: string): Observable<Array<Quiz>> {
        let url = opcion == "todos" ? `${CONFIG.apiUrl}quizz/todos/${cadena}` :
            `${CONFIG.apiUrl}quizz/${this.authService.getAuthUserId()}/seguidos/${cadena}`
        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response)
                observer.complete();
            })
        });
    }

    obtenerQuizzSeguidos(inicio: number, fin: number): Observable<Array<Quiz>> {
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

    obtenerAllQuizz(inicio: number, fin: number): Observable<Array<Quiz>> {
        let cadena = inicio + "-" + fin;
        let url = `${CONFIG.apiUrl}quizz/todos/${cadena}`;

        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response)
                observer.complete();
            })
        });
    }

    getQuizz(id: string): Observable<Quiz> {
        let url = `${CONFIG.apiUrl}quizz/${this.resolveUrl(id)}`;
        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                let rawquiz = response.respuesta;
                let quiz = JSON.parse(rawquiz.contenido);
                quiz.id = rawquiz.id;
                quiz.tipo = rawquiz.tipo;
                observer.next(quiz)
                observer.complete();
            })
        });
    }

    getQuizzes(nombre: string): Observable<Array<Quiz>> {
        let url = `${CONFIG.apiUrl}quizzes/${nombre}`;

        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });
    }



    borraQuizz(quiz: Quiz, admin?: boolean): Observable<void> {
        let url = `${CONFIG.apiUrl}borraQuiz`;
        let body = { id: quiz.id, admin: admin };

        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                this.notifyService.notify("Has borrado tu quizz correctamente, una gran perdida...", "success");
                this.deleteImages(quiz);
                location.reload();
                observer.next()
                observer.complete();
            })
        });
    }



    listaModeracion(): Observable<Array<Quiz>> {

        let url = `${CONFIG.apiUrl}quizz/moderacion`;
        return Observable.create(observer => {
            this.restService.peticionHttp(url).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });
    }

    moderaQuizz(quiz: Quiz, accion: boolean): Observable<boolean> { //PROTEGIDO
        let url = `${CONFIG.apiUrl}modera`;
        let body = { quizz: quiz.id, usuario: this.authService.getAuthUserId(), decision: accion };
        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                if (response.deleted) {
                    this.borraQuizz(quiz, true).subscribe();
                }
                observer.next()
                observer.complete();
            })
        });

    }
    cambiaTipo(quiz: Quiz, privado: boolean): Observable<void> {
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