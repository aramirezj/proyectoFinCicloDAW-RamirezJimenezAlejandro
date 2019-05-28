import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Quizz } from '../modelo/Quizz';
import { QuizzService } from '../services/quizz.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgProgressModule, NgProgressService } from 'ng2-progressbar';
import { Respuesta } from '../modelo/Respuesta';
import { Pregunta } from '../modelo/Pregunta';
import { Solucion } from '../modelo/Solucion';
import { NotifyService } from '../services/notify.service';
import { MatSelectModule } from '@angular/material/select';
import { AngularFireStorage } from 'angularfire2/storage';
import * as $ from 'jquery';
import 'hammerjs';

@Component({
  selector: 'app-ver-quizz',
  templateUrl: './ver-quizz.component.html',
  styleUrls: ['./ver-quizz.component.scss']
})
export class VerQuizzComponent implements OnInit {
  rawid:string
  id: number
  quizz: Quizz
  resultado: boolean
  cargado: boolean
  solucionado: Solucion
  downloadURL: any
  urlShare:string
  public quizzForm: FormGroup

  constructor(
    private quizzService: QuizzService,
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private bar: NgProgressService,
    private notifyService: NotifyService,
    private afStorage: AngularFireStorage
  ) {
    this.resultado = false;
    this.cargado = false;
    this.quizzForm = this.fb.group({})
  }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      this.rawid = params['id'];
      this.getQuizz();
      this.bar.start();
      setTimeout(() => {

        this.generaFormulario();
        this.cargado = true;
        this.bar.done();

      }, 500);

    });

  }

  generaFormulario() {
    let cp = this.quizz.preguntas.length;
    let grupo: any;
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
    let cp = this.quizz.preguntas.length;

    let prerespondidas = $(".activado");
    for (let x = 1; x <= cp; x++) {
      totales[x] = 0;
    }
    let preguntas: Array<Pregunta> = this.quizz.preguntas;
    for (let i = 0; i < cp; i++) {
      for (let j = 0; j < preguntas[i].respuestas.length; j++) {
        let p1 = preguntas[i].respuestas[j].enunciado.trim();
        let p2 = prerespondidas[i].childNodes[0].textContent;
        if (p1 == p2) {
          preguntas[i].eleccion = preguntas[i].respuestas[j];
        }
      }
    }

    let respondidas: Array<Respuesta> = []
    for (let pregunta of preguntas) {
      respondidas.push(pregunta.eleccion);
    }
    console.log(respondidas)
    for (let respuesta of respondidas) {
      for (let afinidad of respuesta.afinidades) {
        totales[afinidad.ids] = +afinidad.cantidad + +totales[afinidad.ids]
      }
    }
    for (let q = 1; q <= totales.length; q++) {
      if (totales[q] > ganador) {
        ganador = totales[q];
        id = q;
      }
    }
    id--;
    this.solucionado = this.quizz.soluciones[id];
    
    this.solucionado.image = this.afStorage.ref(this.solucionado.image).getDownloadURL();
    if (this.solucionado.image == null) {
      this.solucionado.image = "hehexd.png"
    }
    this.resultado = true;
    this.urlShare = "https://twitter.com/share?url="+window.location.href+"&amp;text=¡Obtuve%20"+this.solucionado.titulo+"!%20&amp;hashtags=Hasquiz";
    
   // $(".shareme").attr("href",this.urlShare);
    setTimeout(() => {
      $(".mat-card-header-text")[0].style.width="100%";
      $(".mat-card-header-text")[0].style.margin="0";
      document.getElementById("shareme").setAttribute("href",this.urlShare);
    }, 100);
   
    this.cargado = false;



  }

  getQuizz() {
    let pre: any;
    this.quizzService.getQuizz(this.rawid)
      .then(resp => {
        this.quizz = resp;
        console.log(this.quizz)
        this.id=this.quizz.id;

      })
  }
  seleccion(id) {
    let long = this.quizz.preguntas[id[0]].respuestas.length;
    for (let i = 0; i < long; i++) {
      let ele = "#" + id[0] + i;
      $(ele).addClass("desactivado");
    }
    $("#" + id).removeClass("desactivado");
    $("#" + id).addClass("activado");
    let totalRespondidas = $(".activado").length;
    if (totalRespondidas == this.quizz.preguntas.length) {
      this.onSubmit();
    } else {
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
        elemento = document.getElementById('p' + nextId);
      }
      elemento.scrollIntoView(false);


    }

  }


}
