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
  public id: number
  isLoaded: boolean = false;
  constructor(
    private userService: UserService,
    private router: ActivatedRoute

  ) { }

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.id = +params['id']
      if(isNaN(this.id)){
        this.userService.currentMessage.subscribe(message => this.id = message)
      }
      this.getUserWall();
    })

  }

  getUserWall() {
    this.userService.getUserWall(this.id)
      .subscribe(resp => {
        this.quizzs = resp;
        this.isLoaded = true;
      })
  }

}
