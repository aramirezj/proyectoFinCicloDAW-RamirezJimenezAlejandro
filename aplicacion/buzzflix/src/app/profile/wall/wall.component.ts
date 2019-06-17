import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Quizz } from 'src/app/modelo/Quizz';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss']
})
export class WallComponent implements OnInit {
  public quizzs
  public id:number
  isLoaded:boolean=false;
  constructor(
    private userService:UserService,
    private router:ActivatedRoute
    
  ) { }

  ngOnInit() {
    this.router.params.subscribe(params =>{
     this.id=+params['id']
     this.getUserWall();
    })
   
  }



  getUserWall(){
    this.userService.getUserWall(this.id)
    .then(resp=>{
      if(resp.status == '200'){
        this.quizzs=resp.cont;
        this.isLoaded=true;
      }else{
        this.quizzs=null;
        this.isLoaded=true;
      }
    })

  }

}
