import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss']
})
export class WallComponent implements OnInit {
  public quizzes;
  public nickname;
  isLoaded: boolean = false;
  constructor(
    private userService: UserService,
    private router: ActivatedRoute

  ) { }

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.nickname = params['nickname']
     if(this.nickname==undefined){
        let nick = window.location.href.split("perfil/")[1];
        nick = nick.replace("/wall","");
        this.nickname=nick;
      }
      this.getUserWall();
    })

  }

  getUserWall() {
    this.userService.getUserWall(this.nickname)
      .subscribe(resp => {
        this.quizzes = resp;
        this.isLoaded = true;
      })
  }

}
