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
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-moderacion',
  templateUrl: './moderacion.component.html',
  styleUrls: ['./moderacion.component.scss']
})
export class ModeracionComponent implements OnInit {
  quizzs: Array<Quizz>
  indice: number=0
  isLoaded:boolean=false;
  constructor(
    private quizzService: QuizzService,
    private afStorage: AngularFireStorage
    ) { }

  ngOnInit() {
    this.quizzService.listaModeracion()
    .then(resp=>{
      this.quizzs=resp;
      this.isLoaded=true;
    })
  }

  juzga(decision:boolean){
    this.quizzService.moderaQuizz(this.quizzs[this.indice].id,decision);
    //this.indice++;
  }

}
