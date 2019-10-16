import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';

import { AuthService } from '../services/auth.service';
import { FileService } from '../services/file.service';
import { QuizzService } from '../services/quizz.service';

import { Quizz } from '../modelo/Quizz';
import { Respuesta } from '../modelo/Respuesta';
import { Pregunta } from '../modelo/Pregunta';
import { Solucion } from '../modelo/Solucion';

@Component({
  selector: 'app-ver-quizz',
  templateUrl: './ver-quizz.component.html',
  styleUrls: ['./ver-quizz.component.scss']
})
export class VerQuizzComponent implements OnInit {
  rawid: string
  id: number
  backupQuizz: Quizz
  quizz: Quizz
  resultado: boolean
  isLoaded: boolean
  solucionado: Solucion
  downloadURL: any
  urlShare: string
  urlImg: string | any
  quizzForm: FormGroup
  subsRouter: Subscription
  constructor(
    private authService: AuthService, //Usado en vista
    private quizzService: QuizzService,
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private fileService: FileService,
    public dialog: MatDialog
  ) {
    this.resultado = false;
    this.isLoaded = false;
    this.quizzForm = this.fb.group({})
  }

  ngOnInit() {
    this.subsRouter = this.router.queryParams.subscribe(() => {
      this.rawid = window.location.href;
      if (this.rawid == null) {
        this.router.params.subscribe((params) => {
          this.rawid = params['id'];
          this.getQuizz();
        });
      } else {
        this.getQuizz();
      }
    });
  }
  ngOnDestroy() {
    this.subsRouter.unsubscribe();
  }

  generaFormulario() {
    let cp = this.quizz.preguntas.length;
    for (let i = 1; i <= cp; i++) {
      let name: string = "" + i;
      this.quizzForm.addControl(name, new FormControl(null, []));
      this.quizzForm.controls[name].setValidators([Validators.required]);
    }
    this.quizz.id = this.id

  }

  calcularGanador(): number {
    let totales: Array<number> = [];
    let id = 0;
    let ganador = 0;
    let foundWinner = false;
    let cp = this.quizz.preguntas.length;
    let respondidas: Array<Respuesta> = [];
    for (let pregunta of this.quizz.preguntas) {
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

  onSubmit() {
    this.solucionado = this.quizz.soluciones[this.calcularGanador()];
    this.urlImg = this.fileService.obtenerUrl(this.solucionado.image);

    this.resultado = true;

    let preUrl = window.location.href;
    this.urlShare = "https://twitter.com/intent/tweet?text=¡Obtuve%20" + this.solucionado.titulo + "!%20" + preUrl + " vía @hasquiz";
  }

  getQuizz() {
    this.quizzService.getQuizz(this.rawid)
      .subscribe(resp => {
        this.quizz = resp;
        this.backupQuizz = resp;
        if (this.quizz != null) {
          this.id = this.quizz.id;
          this.generaFormulario();
          this.isLoaded = true;
        }
      })
  }
  seleccion(pregunta: Pregunta, respuesta: Respuesta) {


    pregunta.eleccion = respuesta;
    let verdad = true;
    for (let pregunta of this.quizz.preguntas) {
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
      title: 'Si crees que este quiz incluye contenido abusivo o imagenes que incitan al odio, puedes reportarlo y será investigado.'
    };

    const dialogRef = this.dialog.open(DialogboxComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => this.reportar(data)

    );
  }

  reportar(accion) {
    if (accion) {
      this.quizzService.reportarQuiz(this.id).subscribe();
    }
  }

  reiniciaQuiz(){
    for(let pregunta of this.quizz.preguntas){
      pregunta.eleccion=null;
    }
    this.resultado=false;
  }


}
