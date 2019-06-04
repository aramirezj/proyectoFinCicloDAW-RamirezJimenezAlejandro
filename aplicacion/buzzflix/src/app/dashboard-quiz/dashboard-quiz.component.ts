import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { QuizzService } from '../services/quizz.service';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-dashboard-quiz',
  templateUrl: './dashboard-quiz.component.html',
  styleUrls: ['./dashboard-quiz.component.scss']
})
export class DashboardQuizComponent implements OnInit {
  quizzes
  nombre:string
  navigationSubscription;
  isLoaded:boolean=false
  constructor(
    private router2: Router,
    private router: ActivatedRoute,
    private quizzService:QuizzService,
    private notifyService:NotifyService
  ) { 
    this.isLoaded=false;
    this.navigationSubscription = this.router2.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  initialiseInvites() {
    this.router.params.subscribe((params) => {
      this.nombre = params['nombre'];})
    this.getQuizzes();
  }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      this.nombre = params['nombre'];})
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  getQuizzes(){
    this.quizzService.getQuizzes(this.nombre)
    .then(resp=>{
      this.quizzes=resp;
      if(this.quizzes!=null){
        this.notifyService.notify("Búsqueda realizada","success");
      }
      this.isLoaded=true;
    })
  }

}
