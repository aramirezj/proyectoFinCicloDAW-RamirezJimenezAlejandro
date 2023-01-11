import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss']
})
export class WallComponent {
  quizzes;
  nickname: string;
  isLoaded: boolean = false;
  subsRouter: Subscription;
  constructor(
    private userService: UserService,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subsRouter = this.router.parent.params.subscribe((params) => {
      this.nickname = params["nickname"];
      this.getUserWall();
    })
  }
  ngOnDestroy() {
    this.subsRouter.unsubscribe();
  }

  getUserWall() {
    this.userService.getUserWall(this.nickname)
      .subscribe(resp => {
        this.quizzes = resp;
        this.isLoaded = true;
      })
  }
}
