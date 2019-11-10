import { Component } from '@angular/core';
import { Quiz } from '../modelo/Quiz';
import { QuizService } from '../services/quiz.service';
import { NotifyService } from '../services/notify.service';
import { UserService } from '../services/user.service';
import { FileService } from '../services/file.service';

export interface Section {
  name: string;
}
@Component({
  selector: 'app-moderacion',
  templateUrl: './moderacion.component.html',
  styleUrls: ['./moderacion.component.scss']
})
export class ModeracionComponent {
  panelOpenState = false;
  correctas: Section[] = [
    {
      name: 'Que contenga imagenes no adecuadas.'
    },
    {
      name: 'Que sea ofensivo.'
    },
    {
      name: 'Que creas que esta repetido.'
    },
    {
      name: 'Que veas que solo hay una solución posible.'
    }
  ];
  quizzes: Array<Quiz>
  rawquizzes
  indice: number = 0
  isLoaded: boolean = false;
  imagenes: any = [];
  indiceImagenes: number = 0;
  isAdmin: boolean
  constructor(
    private QuizService: QuizService,
    private fileService: FileService,
    private notifyService: NotifyService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.quizzes = [];
    let quizz: Quiz;
    this.QuizService.listaModeracion()
      .subscribe(resp => {
        if (resp != null && resp.length > 0) {
          this.rawquizzes = resp;
          for (let i = 0; i < resp.length; i++) {

            quizz = JSON.parse(resp[i]["contenido"]);
            quizz.id = resp[i].id;
            quizz.titulo = resp[i].titulo;
            this.quizzes.push(quizz);
          }
          if (this.quizzes[0].tipo == 1) {
            for (let i = 0; i < this.quizzes[0].soluciones.length; i++) {
              let preurl = this.quizzes[0].soluciones[i].image;
              let newurl = this.fileService.obtenerUrl(preurl);
              this.imagenes.push(newurl);
            }
          }
        } else {
          this.quizzes = null
        }
        this.isLoaded = true;
      })
    this.userService.isAdmin()
      .subscribe(resp => {
        this.isAdmin = resp;
      });


  }

  juzga(decision: boolean) {
    this.QuizService.moderaQuizz(this.quizzes[this.indice], decision)
      .subscribe();
    this.indice++;
    if (this.indice == this.quizzes.length) {
      this.notifyService.notify("¡Gracias por contribuir en la web! Ya no quedan más para moderar, ¿Por qué no creas el tuyo propio?", "success")
      this.quizzes = null;
    } else {
      this.notifyService.notify("¡Gracias por contribuir en la web! ¡A por el siguiente!", "success")
    }
  }
  controlImagenes(n: number) {
    if (n == 0) {
      this.indiceImagenes = 0;
    } else {
      this.indiceImagenes++;
    }
  }

}
