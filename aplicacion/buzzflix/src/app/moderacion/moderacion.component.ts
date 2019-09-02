import { Component, OnInit } from '@angular/core';
import { Quizz } from '../modelo/Quizz';
import { QuizzService } from '../services/quizz.service';
import { NotifyService } from '../services/notify.service';
import { AngularFireStorage } from 'angularfire2/storage';
import * as $ from 'jquery';
import { UserService } from '../services/user.service';

export interface Section {
  name: string;
}
interface FoodNode {
  name: string;
  children?: FoodNode[];
}
@Component({
  selector: 'app-moderacion',
  templateUrl: './moderacion.component.html',
  styleUrls: ['./moderacion.component.scss']
})
export class ModeracionComponent implements OnInit {
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
  quizzs: Array<Quizz>
  indice: number = 0
  isLoaded: boolean = false;
  imagenes: any = [];
  indiceImagenes: number = 0;
  isAdmin: boolean
  constructor(
    private quizzService: QuizzService,
    private afStorage: AngularFireStorage,
    private notifyService: NotifyService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.quizzs = [];
    let quizz: Quizz;
    this.quizzService.listaModeracion()
      .subscribe(resp => {
        if (resp != null && resp.length>0) {
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

          for (let i = 0; i < this.quizzs[0].preguntas.length; i++) {
            for (let j = 0; j < this.quizzs[0].preguntas[i].respuestas.length; j++) {
              for (let a = 0; a < this.quizzs[0].preguntas[i].respuestas[j].afinidades.length; a++) {
              }
            }
          }

        } else {
          this.quizzs = null
        }
        this.isLoaded = true;
        setTimeout(() => {
          for (let i = 0; i < $(".mat-card-header-text").length; i++) {
            $(".mat-card-header-text")[i].style.width = "100%";
            $(".mat-card-header-text")[i].style.margin = "0";
          }
        }, 200);
      })
    this.userService.isAdmin()
    .subscribe(resp => {
      this.isAdmin=resp;
    });
  }

  juzga(decision: boolean) {
    this.quizzService.moderaQuizz(this.quizzs[this.indice].id, decision)
    .subscribe();
    this.indice++;
    $("html, body").animate({ scrollTop: 0 }, "fast");
    if (this.indice == this.quizzs.length) {
      this.notifyService.notify("¡Gracias por contribuir en la web! Ya no quedan más para moderar, ¿Por qué no creas el tuyo propio?", "success")
      this.quizzs = null;
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
