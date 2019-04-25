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
import {MatSelectModule} from '@angular/material/select';
import 'hammerjs';

@Component({
  selector: 'app-ver-quizz',
  templateUrl: './ver-quizz.component.html',
  styleUrls: ['./ver-quizz.component.scss']
})
export class VerQuizzComponent implements OnInit {
  id: number
  quizz: Quizz
  resultado: boolean
  cargado: boolean
  solucionado: Solucion
  public quizzForm: FormGroup

  constructor(
    private quizzService: QuizzService,
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private bar: NgProgressService,
    private notifyService: NotifyService
  ) {
    this.resultado = false;
    this.cargado = false;
    this.quizzForm = this.fb.group({})
  }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      this.id = +params['id'];
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
    this.quizz.id=this.id
    
  }


  onSubmit() {
    console.log(this.quizzForm.value)
    var verdad = true;
    for (let r = 1; r <= this.quizz.preguntas.length; r++) {
      if (this.quizzForm.value[r] == "Seleccione una respuesta") {
        verdad = false;
      }
    }
    if (verdad) {
      let totales: Array<number> = [];
      let id = 0;
      let ganador = 0;
      let cp = this.quizz.preguntas.length;
      for (let x = 1; x <= cp; x++) {
        totales[x] = 0;
      }
      let preguntas: Array<Pregunta> = this.quizz.preguntas;
      for (let i = 0; i < cp; i++) {
        for (let j = 0; j < preguntas[i].respuestas.length; j++) {
         // let aux = i;
          //aux++;
          let p1 = preguntas[i].respuestas[j].enunciado.trim();
        
          let p2 = this.quizzForm.value[i + 1].enunciado.trim();
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
        }
      }
      id--;
      this.solucionado = this.quizz.soluciones[id];
      
      if(this.solucionado.image== null){
        this.solucionado.image="hehexd.png"
      }
      this.resultado = true;
      this.cargado = false;
    } else {
      this.notifyService.notify("No dejes ninguna sin responder", "error");
    }


  }

  getQuizz() {
    let pre: any;
    this.quizzService.getQuizz(this.id)
      .then(resp => {
        this.quizz = resp;
        console.log(this.quizz)
        
      })

  }

}
