import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { QuizzService } from '../services/quizz.service';
import { Quizz } from '../modelo/Quizz';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  quizzs:Array<Quizz>
  isLoaded:boolean=false;
  constructor(
    private quizzService: QuizzService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getQuizzs();
    
  }

  getQuizzs(){
    this.quizzService.obtenerQuizzSeguidos()
    .then(resp=>{
      this.quizzs=resp;
      this.isLoaded=true;
    })
  }

}
