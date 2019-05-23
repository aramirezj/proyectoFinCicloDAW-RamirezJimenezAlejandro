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

@Component({
  selector: 'app-moderacion',
  templateUrl: './moderacion.component.html',
  styleUrls: ['./moderacion.component.scss']
})
export class ModeracionComponent implements OnInit {
  quizzs: Array<Quizz>
  indice: number = 0
  isLoaded: boolean = false;
  imagenes: any = [];
  indiceImagenes: number = 0;
  constructor(
    private quizzService: QuizzService,
    private afStorage: AngularFireStorage,
    private notifyService: NotifyService
  ) { }

  ngOnInit() {
    this.quizzs = [];
    let quizz: Quizz;
    this.quizzService.listaModeracion()
      .then(resp => {
        if (resp != null) {
          for (let i = 0; i < resp.length; i++) {
            quizz = JSON.parse(resp[i]["contenido"]);
            quizz.id = resp[i].id;
            quizz.titulo = resp[i].titulo;
            this.quizzs.push(quizz);
          }
          for (let i = 0; i < this.quizzs[0].soluciones.length; i++) {
            let preurl = this.quizzs[0].soluciones[i].image;
            let newurl = this.afStorage.ref(preurl).getDownloadURL();
            this.imagenes.push(newurl);
          }
          
        }else{
          this.quizzs=null
        }
        this.isLoaded = true;
      })
  }

  juzga(decision: boolean) {
    this.quizzService.moderaQuizz(this.quizzs[this.indice].id, decision);
    this.indice++;
    $("html, body").animate({ scrollTop: 0 }, "fast");
    this.notifyService.notify("¡Gracias por contribuir en la web! ¡A por el siguiente!", "success")
    if (this.indice == this.quizzs.length) {
      this.quizzs = null;
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
