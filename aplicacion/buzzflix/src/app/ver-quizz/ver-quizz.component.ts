import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Quizz } from '../modelo/Quizz';
import { QuizzService } from '../services/quizz.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgProgress } from 'ngx-progressbar';
import { Respuesta } from '../modelo/Respuesta';
import { Pregunta } from '../modelo/Pregunta';
import { Solucion } from '../modelo/Solucion';
import { AngularFireStorage } from 'angularfire2/storage';
import * as $ from 'jquery';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-ver-quizz',
  templateUrl: './ver-quizz.component.html',
  styleUrls: ['./ver-quizz.component.scss']
})
export class VerQuizzComponent implements OnInit {
  rawid: string
  id: number
  quizz: Quizz
  resultado: boolean
  cargado: boolean
  solucionado: Solucion
  downloadURL: any
  urlShare: string
  public quizzForm: FormGroup

  constructor(
    private quizzService: QuizzService,
    private authService:AuthService,
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private bar: NgProgress,
    private afStorage: AngularFireStorage,
    public dialog: MatDialog
    ) {
    this.resultado = false;
    this.cargado = false;
    
    this.quizzForm = this.fb.group({})
  }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      this.rawid = params['id'];
      this.getQuizz();
    });

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

  onSubmit() {
    let totales: Array<number> = [];
    let id = 0;
    let ganador = 0;
    let foundWinner=false;
    let cp = this.quizz.preguntas.length;

    let prerespondidas = $(".activado");

    for (let x = 1; x <= cp; x++) {
      totales[x] = 0;
    }
    let preguntas: Array<Pregunta> = this.quizz.preguntas;
    for (let i = 0; i < cp; i++) {
      for (let j = 0; j < preguntas[i].respuestas.length; j++) {
        let p1 = preguntas[i].respuestas[j].enunciado.trim();
        let p2 = prerespondidas[i].childNodes[0].textContent.trim();
        if (p1 == p2) {
          preguntas[i].eleccion = preguntas[i].respuestas[j];
        }
      }
    }

    let respondidas: Array<Respuesta> = []
    for (let pregunta of preguntas) {
      respondidas.push(pregunta.eleccion);
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
        foundWinner=true;
      }
    }
    if(foundWinner){
      id--;
    }
    this.solucionado = this.quizz.soluciones[id];
    this.solucionado.image = this.afStorage.ref(this.solucionado.image).getDownloadURL();
    if (this.solucionado.image == null) {
      this.solucionado.image = "hehexd.png"
    }
    this.resultado = true;//%20 window.location.href
    let preUrl = window.location.href;
    preUrl = preUrl.replace("/#","");
    this.urlShare = "https://twitter.com/intent/tweet?text=¡Obtuve%20" + this.solucionado.titulo + "!%20"+preUrl+";via=hasquiz;";

    setTimeout(() => {
      $(".mat-card-header-text")[0].style.width = "100%";
      $(".mat-card-header-text")[0].style.margin = "0";
      document.getElementById("shareme").setAttribute("href", this.urlShare);
    }, 100);

    this.cargado = false;



  }

  getQuizz() {
    this.quizzService.getQuizz(this.rawid)
      .subscribe(resp => {
        this.quizz = resp;
        if (this.quizz != null) {
          this.id = this.quizz.id;
          this.bar.start();
          this.generaFormulario();
          this.cargado = true;
          this.bar.done();
        }

      })
  }
  seleccion(id) {
    let long = this.quizz.preguntas[id[0]].respuestas.length;
    for (let i = 0; i < long; i++) {
      let ele = "#" + id[0] + i;
      $(ele).addClass("desactivado");
      $(ele).removeClass("activado");
    }
    $("#" + id).removeClass("desactivado");
    $("#" + id).addClass("activado");
    let totalRespondidas = $(".activado").length;

    if (totalRespondidas == this.quizz.preguntas.length) {
      this.onSubmit();
    } else {
      console.log(id)
      let nextId: number = id[0];
      let elemento = null
      nextId++;
      nextId++;
      if (nextId >= this.quizz.preguntas.length) {
        let lastP = this.quizz.preguntas.length;
        lastP--;
        let lastR = this.quizz.preguntas[lastP].respuestas.length;
        lastR--;
        elemento = document.getElementById(lastP + "" + lastR);
      } else {
        nextId--;
        elemento = document.getElementById(nextId+"1");
      }
      elemento.scrollIntoView(false);
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

  reportar(accion){
    if(accion){
      this.quizzService.reportarQuiz(this.id).subscribe();
    }
  }


}
