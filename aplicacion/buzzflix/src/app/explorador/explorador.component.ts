import { Component, OnInit } from '@angular/core';
import { Quizz } from '../modelo/Quizz';
import { QuizzService } from '../services/quizz.service';

@Component({
  selector: 'app-explorador',
  templateUrl: './explorador.component.html',
  styleUrls: ['./explorador.component.scss']
})
export class ExploradorComponent implements OnInit {
  quizzs:Array<Quizz>
  isLoaded:boolean=false;
  constructor(
    private quizzService: QuizzService
  ) {

   }
   ngOnInit() {
    this.getQuizzs();
  }

  getQuizzs(){
    this.quizzService.obtenerAllQuizz()
    .then(resp=>{
      this.quizzs=resp;
      if(this.quizzs.length==0){
        this.quizzs=null;
      }
      this.isLoaded=true
    })
  }

}
