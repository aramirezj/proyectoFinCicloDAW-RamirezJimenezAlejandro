import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';

import { AuthService } from '../services/auth.service';
import { FileService } from '../services/file.service';
import { QuizService } from '../services/quiz.service';

import { Quiz } from '../modelo/Quiz';
import { Respuesta } from '../modelo/Respuesta';
import { Pregunta } from '../modelo/Pregunta';
import { Solucion } from '../modelo/Solucion';

@Component({
  selector: 'app-ver-quiz',
  templateUrl: './ver-quiz.component.html',
  styleUrls: ['./ver-quiz.component.scss']
})
export class VerQuizComponent implements OnInit {
  rawid: string
  id: number
  quiz: Quiz
  resultado: boolean
  isLoaded: boolean
  solucionado: Solucion
  downloadURL: any
  urlShare: string
  urlImg: string | any
  quizForm: FormGroup
  subsRouter: Subscription
  aciertos: number
  porcentaje: number
  colorResu:string
  mensajeFinal:string
  constructor(
    private authService: AuthService, //Usado en vista
    private quizService: QuizService,
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private fileService: FileService,
    public dialog: MatDialog
  ) {
    this.resultado = false;
    this.isLoaded = false;
    this.quizForm = this.fb.group({})
  }

  ngOnInit() {
    this.subsRouter = this.router.queryParams.subscribe(() => {
      this.rawid = window.location.href;
      if (this.rawid == null) {
        this.router.params.subscribe((params) => {
          this.rawid = params['id'];
          this.getQuiz();
        });
      } else {
        this.getQuiz();
      }
    });
  }
  ngOnDestroy() {
    this.subsRouter.unsubscribe();
  }

  generaFormulario() {
    let cp = this.quiz.preguntas.length;
    for (let i = 1; i <= cp; i++) {
      let name: string = "" + i;
      this.quizForm.addControl(name, new FormControl(null, []));
      this.quizForm.controls[name].setValidators([Validators.required]);
    }
    this.quiz.id = this.id

  }

  calcularGanador(): number {
    let totales: Array<number> = [];
    let id = 0;
    let ganador = 0;
    let foundWinner = false;
    let cp = this.quiz.preguntas.length;
    let respondidas: Array<Respuesta> = [];
    for (let pregunta of this.quiz.preguntas) {
      respondidas.push(pregunta.eleccion);
    }

    for (let x = 1; x <= cp; x++) {
      totales[x] = 0;
    }

    for (let respuesta of respondidas) {
      for (let afinidad of respuesta.afinidades) {
        totales[afinidad.ids] = +afinidad.cantidad + +totales[afinidad.ids]
      }
    }
    for (let q = 1; q <= totales.length; q++) {
      if (totales[q] > ganador) {
        ganador = totales[q];
        id = q;
        foundWinner = true;
      }
    }
    if (foundWinner) {
      id--;
    }
    return id;
  }

  resultadoPuntuacion(): number {
    this.aciertos = 0;
    for (let pregunta of this.quiz.preguntas) {
      if (pregunta.eleccion.correcta) {
        this.aciertos++;
      }
    }
    let porcentaje = Math.round((this.aciertos * 100) / this.quiz.preguntas.length);
    this.porcentaje = porcentaje;
    this.colorResu = this.porcentaje > 49 ? "limegreen" : "e14705";
    return porcentaje == 100 ? 4 : porcentaje > 75 ? 3 : porcentaje > 50 ? 2 : porcentaje > 25 ? 1 : 0;
  }

  onSubmit() {
    if (this.quiz.tipo == 1) {
      this.solucionado = this.quiz.soluciones[this.calcularGanador()];
      this.urlImg = this.fileService.obtenerUrl(this.solucionado.image);

    } else {
      this.solucionado = this.quiz.soluciones[this.resultadoPuntuacion()];
    }
    this.resultado = true;
    let preUrl = window.location.href;

    this.mensajeFinal = this.quiz.tipo == 1 ? this.solucionado.titulo : this.aciertos + " aciertos de " + this.quiz.preguntas.length;

    this.urlShare = "https://twitter.com/intent/tweet?text=¡Obtuve%20" + this.mensajeFinal + "!%20" + preUrl + " vía @hasquiz";
  }

  getQuiz() {
    this.quizService.getQuizz(this.rawid)
      .subscribe(resp => {
        this.quiz = resp;
        if (this.quiz != null) {
          this.id = this.quiz.id;
          this.generaFormulario();
          this.isLoaded = true;
        }
      })
  }
  seleccion(pregunta: Pregunta, respuesta: Respuesta) {

    if (this.quiz.tipo == 1 || pregunta.eleccion == null) {
      pregunta.eleccion = respuesta;
    }

    let verdad = true;
    for (let pregunta of this.quiz.preguntas) {
      if (pregunta.eleccion == null) {
        verdad = false;
      }
    }
    if (verdad) {
      this.onSubmit();
    }

  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {

    };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: 1,
      title: 'Si crees que este quiz incluye contenido abusivo o imágenes que incitan al odio, puedes reportarlo y será investigado.'
    };

    const dialogRef = this.dialog.open(DialogboxComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => this.reportar(data)

    );
  }

  reportar(accion) {
    if (accion) {
      this.quizService.reportarQuiz(this.id).subscribe();
    }
  }

  reiniciaQuiz() {
    for (let pregunta of this.quiz.preguntas) {
      pregunta.eleccion = null;
    }
    this.resultado = false;
  }

  volver() {
    window.history.back();
  }


}
